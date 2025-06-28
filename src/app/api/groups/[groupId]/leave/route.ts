import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";
import jwt from "jsonwebtoken";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    // Extract and verify the JWT token
    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; name: string };
      const authUserId = decoded.id;
      
      // Get the profile to find the actual user_id
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('user_id', authUserId)
        .single();
        
      if (profileError || !profile) {
        return NextResponse.json(
          { error: "User profile not found" },
          { status: 401 }
        );
      }
      
      userId = profile.user_id;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check if user is a member of the group and get their role
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 404 }
      );
    }

    // Prevent group owners from leaving (they must transfer ownership first)
    if (membership.role === "owner") {
      return NextResponse.json(
        { error: "Group owners cannot leave the group. Please transfer ownership first or delete the group." },
        { status: 403 }
      );
    }

    // Remove the user from the group
    const { error: leaveError } = await supabaseAdmin
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (leaveError) {
      console.error("Error leaving group:", leaveError);
      return NextResponse.json(
        { error: "Failed to leave group" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Successfully left the group"
    });
  } catch (error) {
    console.error("Error in DELETE /api/groups/[groupId]/leave:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
