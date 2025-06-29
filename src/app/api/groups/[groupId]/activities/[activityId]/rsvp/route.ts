import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

// POST /api/groups/[groupId]/activities/[activityId]/rsvp - RSVP to an activity
export async function POST(
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

    // Parse request body
    const { response } = await request.json();

    // Validate response
    if (!response || !['yes', 'no'].includes(response)) {
      return NextResponse.json({ error: "Response must be 'yes' or 'no'" }, { status: 400 });
    }

    // Upsert the RSVP (update if exists, insert if not)
    const { data: rsvp, error: rsvpError } = await supabaseAdmin
      .from("activity_rsvps")
      .upsert({
        activity_id: activityId,
        user_id: userId,
        response
      }, {
        onConflict: 'activity_id,user_id'
      })
      .select()
      .single();

    if (rsvpError) {
      console.error("Error creating/updating RSVP:", rsvpError);
      return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
    }

    return NextResponse.json({
      message: "RSVP saved successfully",
      rsvp: {
        response: rsvp.response,
        activityId: rsvp.activity_id,
        userId: rsvp.user_id
      }
    });

  } catch (error) {
    console.error("Error handling RSVP:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/groups/[groupId]/activities/[activityId]/rsvp - Remove RSVP
export async function DELETE(
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

    // Delete the RSVP
    const { error: deleteError } = await supabaseAdmin
      .from("activity_rsvps")
      .delete()
      .eq("activity_id", activityId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Error deleting RSVP:", deleteError);
      return NextResponse.json({ error: "Failed to remove RSVP" }, { status: 500 });
    }

    return NextResponse.json({
      message: "RSVP removed successfully"
    });

  } catch (error) {
    console.error("Error removing RSVP:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
