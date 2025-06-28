import { useState } from "react";

interface Group {
  id: string;
  name: string;
  description: string;
  invite_link: string;
  created_at: string;
  created_by: string;
  group_members: { role: string }[];
}

interface GroupCardProps {
  group: Group;
  userRole: string;
  onLeaveGroup?: (groupId: string, groupName: string) => void;
}

export default function GroupCard({ group, userRole, onLeaveGroup }: GroupCardProps) {
  const isOwner = userRole === "owner";
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleCopyInviteLink = async () => {
    try {
      // Create the full invite URL
      const inviteUrl = `${window.location.origin}/join/${group.invite_link}`;

      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = `${window.location.origin}/join/${group.invite_link}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveGroup = async () => {
    if (isOwner) {
      alert("Group owners cannot leave the group. Please transfer ownership first or delete the group.");
      return;
    }

    if (!confirm(`Are you sure you want to leave "${group.name}"? You'll need a new invite link to rejoin.`)) {
      return;
    }

    setIsLeaving(true);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`/api/groups/${group.id}/leave`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        onLeaveGroup?.(group.id, group.name);
      } else {
        alert(`Failed to leave group: ${result.error}`);
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("An error occurred while leaving the group. Please try again.");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{group.name}</h3>
        {isOwner && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Owner</span>}
      </div>

      {group.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          {group.group_members?.length || 1} member{(group.group_members?.length || 1) !== 1 ? "s" : ""}
        </span>
        <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-amber-600 text-white text-sm py-2 px-3 rounded-md hover:bg-amber-700 transition-colors">View Group</button>

        <button onClick={handleCopyInviteLink} className="bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1" title="Copy invite link">
          {copied ? (
            <>
              <span className="text-xs">✓</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span className="text-xs">🔗</span>
              <span>Invite</span>
            </>
          )}
        </button>

        {isOwner ? (
          <button className="bg-gray-100 text-gray-700 text-sm py-2 px-3 rounded-md hover:bg-gray-200 transition-colors">Settings</button>
        ) : (
          <button
            onClick={handleLeaveGroup}
            disabled={isLeaving}
            className="bg-red-500 text-white text-sm py-2 px-3 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
            title="Leave group"
          >
            {isLeaving ? "Leaving..." : "Leave"}
          </button>
        )}
      </div>
    </div>
  );
}
