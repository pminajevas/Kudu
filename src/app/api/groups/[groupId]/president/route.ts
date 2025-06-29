import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

// GET /api/groups/[groupId]/president - Get current president for the group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    
    // Get auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      const authUserId = decoded.id;
      
      // Get the profile to find the actual user_id
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('user_id', authUserId)
        .single();
        
      if (profileError || !profile) {
        return NextResponse.json(
          { error: "User profile not found. Please complete registration." },
          { status: 401 }
        );
      }
      
      userId = profile.user_id;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user is a member of this group
    const { data: membershipData, error: membershipError } = await supabaseAdmin
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    if (membershipError || !membershipData) {
      return NextResponse.json({ error: "Access denied. You are not a member of this group." }, { status: 403 });
    }

    // First, check if there's already a president for this week
    console.log("API - Checking for existing president for group:", groupId);
    
    // Calculate current week dates (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days to Monday
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartStr = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD format
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    console.log("API - Week range:", weekStartStr, "to", weekEndStr);

    // Check for existing president this week
    const { data: existingPresident, error: existingError } = await supabaseAdmin
      .from('group_presidents')
      .select('user_id, week_start_date, week_end_date')
      .eq('group_id', groupId)
      .eq('week_start_date', weekStartStr)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("Error checking for existing president:", existingError);
    }

    let currentPresident = existingPresident;

    // If no president exists for this week, elect one
    if (!existingPresident) {
      console.log("API - No president found, electing new one");
      
      // Get all group members
      const { data: members, error: membersError } = await supabaseAdmin
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (membersError || !members || members.length === 0) {
        console.error("Error fetching group members:", membersError);
        return NextResponse.json({ error: "No group members found" }, { status: 500 });
      }

      // Get members who were president in the last 4 weeks (for fairness)
      const fourWeeksAgo = new Date(weekStart);
      fourWeeksAgo.setDate(weekStart.getDate() - 28);
      const fourWeeksAgoStr = fourWeeksAgo.toISOString().split('T')[0];

      const { data: recentPresidents, error: recentError } = await supabaseAdmin
        .from('group_presidents')
        .select('user_id')
        .eq('group_id', groupId)
        .gte('week_start_date', fourWeeksAgoStr)
        .lt('week_start_date', weekStartStr);

      if (recentError) {
        console.error("Error fetching recent presidents:", recentError);
      }

      const recentPresidentIds = recentPresidents?.map(p => p.user_id) || [];
      
      // Filter out recent presidents for fairness
      const eligibleMembers = members.filter(m => !recentPresidentIds.includes(m.user_id));
      
      // If no eligible members (all were recent presidents), use all members
      const candidatesPool = eligibleMembers.length > 0 ? eligibleMembers : members;
      
      // Randomly select a president
      const selectedMember = candidatesPool[Math.floor(Math.random() * candidatesPool.length)];
      
      console.log("API - Selected new president:", selectedMember.user_id);

      // Insert the new president record
      const { data: newPresident, error: insertError } = await supabaseAdmin
        .from('group_presidents')
        .insert({
          group_id: groupId,
          user_id: selectedMember.user_id,
          week_start_date: weekStartStr,
          week_end_date: weekEndStr
        })
        .select('user_id, week_start_date, week_end_date')
        .single();

      if (insertError) {
        // If it's a duplicate key error (race condition), try to fetch the existing president
        if (insertError.code === '23505') {
          console.log("API - Race condition detected, fetching existing president");
          const { data: racePresident, error: raceError } = await supabaseAdmin
            .from('group_presidents')
            .select('user_id, week_start_date, week_end_date')
            .eq('group_id', groupId)
            .eq('week_start_date', weekStartStr)
            .single();
          
          if (raceError) {
            console.error("Error fetching president after race condition:", raceError);
            return NextResponse.json({ error: "Failed to resolve president election" }, { status: 500 });
          }
          
          currentPresident = racePresident;
        } else {
          console.error("Error inserting new president:", insertError);
          return NextResponse.json({ error: "Failed to elect new president" }, { status: 500 });
        }
      } else {
        currentPresident = newPresident;
      }
    }

    console.log("API - Current president:", currentPresident);

    if (!currentPresident) {
      return NextResponse.json({ 
        president: null, 
        isCurrentUserPresident: false,
        message: "No president found for this week"
      });
    }

    // Get the president's name from profiles
    const { data: presidentProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('name')
      .eq('user_id', currentPresident.user_id)
      .single();

    if (profileError) {
      console.error("Error fetching president profile:", profileError);
    }
    
    return NextResponse.json({
      president: {
        userId: currentPresident.user_id,
        name: presidentProfile?.name || 'Unknown User',
        email: 'Not available', // Email not stored in profiles
        weekStartDate: currentPresident.week_start_date,
        weekEndDate: currentPresident.week_end_date
      },
      isCurrentUserPresident: currentPresident.user_id === userId
    });

  } catch (error) {
    console.error("Error in president endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
