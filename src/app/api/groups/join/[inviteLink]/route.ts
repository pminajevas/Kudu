import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ inviteLink: string }> }
) {
  try {
    const { inviteLink } = await params;

    if (!inviteLink) {
      return NextResponse.json(
        { error: "Invite link is required" },
        { status: 400 }
      );
    }

    // Find the group by invite link
    const { data: group, error: groupError } = await supabaseAdmin
      .from("groups")
      .select("id, name, description, created_at")
      .eq("invite_link", inviteLink)
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 404 }
      );
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Error in GET /api/groups/join:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ inviteLink: string }> }
) {
  try {
    const { inviteLink } = await params;

    if (!inviteLink) {
      return NextResponse.json(
        { error: "Invite link is required" },
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

    // Find the group by invite link
    const { data: group, error: groupError } = await supabaseAdmin
      .from("groups")
      .select("id, name")
      .eq("invite_link", inviteLink)
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const { data: existingMember, error: memberCheckError } = await supabaseAdmin
      .from("group_members")
      .select("id")
      .eq("group_id", group.id)
      .eq("user_id", userId)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this group" },
        { status: 409 }
      );
    }

    // Add user to the group
    const { error: joinError } = await supabaseAdmin
      .from("group_members")
      .insert([
        {
          group_id: group.id,
          user_id: userId,
          role: "member",
        },
      ]);

    if (joinError) {
      console.error("Error joining group:", joinError);
      return NextResponse.json(
        { error: "Failed to join group" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully joined "${group.name}"`,
      group: {
        id: group.id,
        name: group.name,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/groups/join:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
