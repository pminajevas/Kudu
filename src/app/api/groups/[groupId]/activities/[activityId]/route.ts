import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

// PUT /api/groups/[groupId]/activities/[activityId] - Update an activity
export async function PUT(
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

    // Check if the activity exists and if the user is the creator
    const { data: existingActivity, error: activityCheckError } = await supabaseAdmin
      .from("activities")
      .select("id, created_by, group_id")
      .eq("id", activityId)
      .eq("group_id", groupId)
      .single();

    if (activityCheckError || !existingActivity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    if (existingActivity.created_by !== userId) {
      return NextResponse.json({ error: "Access denied. You can only edit activities you created." }, { status: 403 });
    }

    // Parse request body
    const { title, description, eventDate } = await request.json();

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Activity title is required" }, { status: 400 });
    }

    // Update the activity
    const { data: updatedActivity, error: updateError } = await supabaseAdmin
      .from("activities")
      .update({
        title: title.trim(),
        description: description?.trim() || '',
        event_date: eventDate || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", activityId)
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

    if (updateError) {
      console.error("Error updating activity:", updateError);
      return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
    }

    // Fetch the author name
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("name")
      .eq("user_id", updatedActivity.created_by)
      .single();

    // Transform the data for frontend consumption
    const transformedActivity = {
      id: updatedActivity.id,
      title: updatedActivity.title,
      description: updatedActivity.description,
      eventDate: updatedActivity.event_date,
      author: profile?.name || 'Unknown User',
      timestamp: updatedActivity.created_at,
      updatedAt: updatedActivity.updated_at
    };

    return NextResponse.json({
      message: "Activity updated successfully",
      activity: transformedActivity
    });

  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/groups/[groupId]/activities/[activityId] - Delete an activity
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

    // Check if the activity exists and if the user is the creator
    const { data: existingActivity, error: activityCheckError } = await supabaseAdmin
      .from("activities")
      .select("id, created_by, group_id")
      .eq("id", activityId)
      .eq("group_id", groupId)
      .single();

    if (activityCheckError || !existingActivity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    if (existingActivity.created_by !== userId) {
      return NextResponse.json({ error: "Access denied. You can only delete activities you created." }, { status: 403 });
    }

    // Delete the activity
    const { error: deleteError } = await supabaseAdmin
      .from("activities")
      .delete()
      .eq("id", activityId);

    if (deleteError) {
      console.error("Error deleting activity:", deleteError);
      return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
    }

    return NextResponse.json({ message: "Activity deleted successfully" });

  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
