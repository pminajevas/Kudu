import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
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
      console.log("Using profile user_id for group creation:", userId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Parse request body
    const { name, description } = await request.json();

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Group name must be 100 characters or less" },
        { status: 400 }
      );
    }

    const { data: group, error: groupError } = await supabaseAdmin
      .from("groups")
      .insert([
        {
          name: name.trim(),
          description: description?.trim() || "",
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (groupError) {
      console.error("Error creating group:", groupError);
      return NextResponse.json(
        { error: "Failed to create group" },
        { status: 500 }
      );
    }
    
    const { error: memberError } = await supabaseAdmin
      .from("group_members")
      .insert([
        {
          group_id: group.id,
          user_id: userId,
          role: "owner",
        },
      ]);

    if (memberError) {
      console.error("Error adding group owner:", memberError);
      // Try to clean up the group if member insertion failed
      await supabaseAdmin.from("groups").delete().eq("id", group.id);
      return NextResponse.json(
        { error: "Failed to create group membership" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Group created successfully",
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        invite_link: group.invite_link,
        created_at: group.created_at,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/groups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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

    // Get groups where the user is a member
    console.log("Fetching groups for user:", userId);
    
    const { data: groups, error } = await supabaseAdmin
      .from("group_members")
      .select(`
        role,
        groups:group_id (
          id,
          name,
          description,
          invite_link,
          created_at,
          created_by
        )
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching groups:", error);
      return NextResponse.json(
        { error: "Failed to fetch groups" },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedGroups = groups?.map(membership => ({
      ...membership.groups,
      group_members: [{ role: membership.role }]
    })) || [];

    console.log("Found groups for user:", transformedGroups.length);

    return NextResponse.json({ groups: transformedGroups });
  } catch (error) {
    console.error("Error in GET /api/groups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
