import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

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

    console.log("Debug - User ID from profile:", userId);
    console.log("Debug - Group ID:", groupId);

    // Check if user is a member of this group
    const { data: membershipData, error: membershipError } = await supabaseAdmin
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    console.log("Debug - Membership query result:", { membershipData, membershipError });

    if (membershipError || !membershipData) {
      // Let's also check what memberships exist for this group
      const { data: allMemberships } = await supabaseAdmin
        .from("group_members")
        .select("user_id, role")
        .eq("group_id", groupId);
      
      console.log("Debug - All memberships for this group:", allMemberships);
      
      return NextResponse.json({ error: "Access denied. You are not a member of this group." }, { status: 403 });
    }

    // Fetch group details with members
    const { data: groupData, error: groupError } = await supabaseAdmin
      .from("groups")
      .select(`
        id,
        name,
        description,
        created_at,
        created_by,
        invite_link,
        group_members (
          user_id,
          role,
          joined_at,
          profiles (
            name
          )
        )
      `)
      .eq("id", groupId)
      .single();

    console.log("Debug - Group query result:", { groupData, groupError });

    if (groupError || !groupData) {
      // Let's also check if the group exists at all
      const { data: basicGroup, error: basicError } = await supabaseAdmin
        .from("groups")
        .select("id, name")
        .eq("id", groupId)
        .single();
      
      console.log("Debug - Basic group check:", { basicGroup, basicError });
      
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Transform the data for easier frontend consumption
    const groupDetails = {
      id: groupData.id,
      name: groupData.name,
      description: groupData.description,
      created_at: groupData.created_at,
      created_by: groupData.created_by,
      invite_link: groupData.invite_link,
      userRole: membershipData.role,
      members: groupData.group_members.map((member: any) => ({
        userId: member.user_id,
        role: member.role,
        joinedAt: member.joined_at,
        email: 'Not available', // Email not stored in profiles table
        fullName: member.profiles?.name || 'Unknown User'
      }))
    };

    return NextResponse.json(groupDetails);

  } catch (error) {
    console.error("Error fetching group details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
