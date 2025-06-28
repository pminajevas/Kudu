import { useState, useEffect } from "react";
import Button from "../ui/Button";
import CreateGroupDialog from "./CreateGroupDialog";
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
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-500 mb-4">You haven't joined any groups yet</div>
            <p className="text-sm text-gray-400 mb-6">Create your first group or join an existing one to get started</p>
          </div>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Started</h3>
          <p className="text-gray-600">Create a new group or join an existing one</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="lg" onClick={() => setShowCreateDialog(true)} className="px-8 py-4 text-lg" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create a Group"}
          </Button>

          <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
            Join a Group
          </Button>
        </div>
      </div>

      <CreateGroupDialog isOpen={showCreateDialog} onClose={() => setShowCreateDialog(false)} onCreateGroup={handleCreateGroup} />
    </div>
  );
}
