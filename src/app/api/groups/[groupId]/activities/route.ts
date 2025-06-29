import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

// GET /api/groups/[groupId]/activities - Fetch activities for a group
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

    // Fetch activities for this group
    const { data: activities, error: activitiesError } = await supabaseAdmin
      .from("activities")
      .select(`
        id,
        title,
        description,
        event_date,
        created_at,
        updated_at,
        created_by
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    if (activitiesError) {
      console.error("Error fetching activities:", activitiesError);
      return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
    }

    // Fetch author information and RSVP data for each activity
    const activitiesWithDetails = await Promise.all(
      activities.map(async (activity: any) => {
        // Get author info
        const { data: profile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("name")
          .eq("user_id", activity.created_by)
          .single();

        // Get RSVP counts
        const { data: rsvps, error: rsvpsError } = await supabaseAdmin
          .from("activity_rsvps")
          .select("response")
          .eq("activity_id", activity.id);

        const rsvpYesCount = rsvps?.filter(r => r.response === 'yes').length || 0;
        const rsvpNoCount = rsvps?.filter(r => r.response === 'no').length || 0;
        const totalRsvpCount = rsvpYesCount + rsvpNoCount;

        // Get current user's RSVP
        const { data: userRsvp, error: rsvpError } = await supabaseAdmin
          .from("activity_rsvps")
          .select("response")
          .eq("activity_id", activity.id)
          .eq("user_id", userId)
          .single();

        return {
          ...activity,
          author: profile?.name || 'Unknown User',
          userRsvp: userRsvp?.response || null,
          rsvp_yes_count: rsvpYesCount,
          rsvp_no_count: rsvpNoCount,
          total_rsvp_count: totalRsvpCount
        };
      })
    );

    // Transform the data for frontend consumption
    const transformedActivities = activitiesWithDetails.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      eventDate: activity.event_date,
      author: activity.author,
      timestamp: activity.created_at,
      updatedAt: activity.updated_at,
      createdBy: activity.created_by,
      isOwner: activity.created_by === userId,
      rsvpYesCount: activity.rsvp_yes_count,
      rsvpNoCount: activity.rsvp_no_count,
      totalRsvpCount: activity.total_rsvp_count,
      userRsvp: activity.userRsvp
    }));

    return NextResponse.json(transformedActivities);

  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/groups/[groupId]/activities - Create a new activity
export async function POST(
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

    // Parse request body
    const { title, description, eventDate } = await request.json();

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Activity title is required" }, { status: 400 });
    }

    // Create the activity
    const { data: activity, error: activityError } = await supabaseAdmin
      .from("activities")
      .insert({
        group_id: groupId,
        title: title.trim(),
        description: description?.trim() || '',
        event_date: eventDate || null,
        created_by: userId
      })
      .select(`
        id,
        title,
        description,
        event_date,
        created_at,
        updated_at,
        created_by
      `)
      .single();

    if (activityError) {
      console.error("Error creating activity:", activityError);
      return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
    }

    // Fetch the author name
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("name")
      .eq("user_id", activity.created_by)
      .single();

    // Transform the data for frontend consumption
    const transformedActivity = {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      eventDate: activity.event_date,
      author: profile?.name || 'Unknown User',
      timestamp: activity.created_at,
      updatedAt: activity.updated_at,
      createdBy: activity.created_by,
      isOwner: activity.created_by === userId,
      rsvpYesCount: 0,
      rsvpNoCount: 0,
      totalRsvpCount: 0,
      userRsvp: null
    };

    return NextResponse.json({
      message: "Activity created successfully",
      activity: transformedActivity
    });

  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
