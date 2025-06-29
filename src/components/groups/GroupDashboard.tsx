import { useState, useEffect } from "react";
import Button from "../ui/Button";
import CreateGroupDialog from "./CreateGroupDialog";
import JoinGroupDialog from "./JoinGroupDialog";
import GroupCard from "./GroupCard";
import Alert from "../ui/Alert";

interface Group {
  id: string;
  name: string;
  description: string;
  invite_link: string;
  created_at: string;
  created_by: string;
  group_members: { role: string }[];
}

interface GroupDashboardProps {
  user: any;
}

export default function GroupDashboard({ user }: GroupDashboardProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  // Fetch user's groups
  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoadingGroups(false);
        return;
      }

      const response = await fetch("/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setGroups(result.groups || []);
      } else {
        console.error("Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleLeaveGroup = (groupId: string, groupName: string) => {
    setMessage(`Successfully left "${groupName}"`);
    // Refresh the groups list
    fetchGroups();
  };

  const handleCreateGroup = async (name: string, description: string) => {
    setIsCreating(true);
    setMessage("");

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setMessage("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Group "${result.group.name}" created successfully!`);
        // Refresh the groups list
        fetchGroups();
      } else {
        setMessage(`Failed to create group: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setMessage("An error occurred while creating the group. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <Alert variant={message.includes("successfully") ? "info" : "info"} className="text-sm">
          {message}
        </Alert>
      )}

      {/* My Groups Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Groups</h2>

        {isLoadingGroups ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading your groups...</div>
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} userRole={group.group_members[0]?.role || "member"} onLeaveGroup={handleLeaveGroup} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {/* Illustrative SVG Icon */}
            <div className="mb-6 flex justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="text-gray-900 text-lg font-medium mb-2">You haven't joined any groups yet</div>
            <p className="text-gray-600">Create your first group or join an existing one to get started</p>
          </div>
        )}
      </div>

      {/* Action Buttons Section - Unified for both new and existing users */}
      {!isLoadingGroups && (
        <div className="flex flex-col items-center text-center">
          {groups.length === 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Get Started</h3>
              <p className="text-gray-500 text-sm">Create your first group or join an existing one</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Modern Orange Create Group Button */}
            <button
              onClick={() => setShowCreateDialog(true)}
              disabled={isCreating}
              className="group relative px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none overflow-hidden"
            >
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>

              {/* Accent border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-300/50 transition-colors duration-300"></div>

              {/* Content with animation */}
              <span className="relative z-10 flex items-center space-x-2 transition-transform duration-200 group-hover:translate-x-0.5">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{isCreating ? "Creating..." : groups.length === 0 ? "Create a Group" : "Create Another Group"}</span>
              </span>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
            </button>

            {/* Join Group Button - Only show for new users */}
            {groups.length === 0 && (
              <button
                onClick={() => setShowJoinDialog(true)}
                className="group relative px-8 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Join a Group</span>
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      <CreateGroupDialog isOpen={showCreateDialog} onClose={() => setShowCreateDialog(false)} onCreateGroup={handleCreateGroup} />

      {/* Join Group Dialog */}
      <JoinGroupDialog
        isOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        onCreateGroup={() => {
          setShowJoinDialog(false);
          setShowCreateDialog(true);
        }}
      />
    </div>
  );
}
