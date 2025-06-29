import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

// GET /api/groups/[groupId]/activities/[activityId]/rsvps - Get all RSVPs for an activity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string; activityId: string }> }
) {
  try {
    const { groupId, activityId } = await params;
    
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

    // Verify the activity exists and belongs to this group
    const { data: activity, error: activityError } = await supabaseAdmin
      .from("activities")
      .select("id")
      .eq("id", activityId)
      .eq("group_id", groupId)
      .single();

    if (activityError || !activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // Get all RSVPs for this activity with user names
    const { data: rsvps, error: rsvpsError } = await supabaseAdmin
      .from("activity_rsvps")
      .select(`
        response,
        created_at,
        user_id,
        profiles!inner(name, user_id)
      `)
      .eq("activity_id", activityId)
      .order("created_at", { ascending: true });

    if (rsvpsError) {
      console.error("Error fetching RSVPs:", rsvpsError);
      return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
    }

    // Transform the data
    const transformedRsvps = rsvps.map((rsvp: any) => ({
      response: rsvp.response,
      userName: rsvp.profiles.name,
      userId: rsvp.user_id,
      createdAt: rsvp.created_at
    }));

    // Group by response
    const yesResponses = transformedRsvps.filter(r => r.response === 'yes');
    const noResponses = transformedRsvps.filter(r => r.response === 'no');

    return NextResponse.json({
      yes: yesResponses,
      no: noResponses,
      totalYes: yesResponses.length,
      totalNo: noResponses.length
    });

  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
