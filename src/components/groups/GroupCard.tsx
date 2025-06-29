import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const isOwner = userRole === "owner";
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleViewGroup = () => {
    router.push(`/groups/${group.id}`);
  };

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
    <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden h-full flex flex-col">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Orange accent border on hover */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-300/30 transition-colors duration-300"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header with title and role */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">{group.name}</h3>
            {isOwner && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200 shadow-sm">
                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Owner
              </span>
            )}
          </div>
        </div>

        {/* Description - flexible content area */}
        <div className="flex-grow">
          {group.description && (
            <div className="mb-6">
              <p className="text-gray-600 text-base leading-relaxed line-clamp-3">{group.description}</p>
            </div>
          )}
        </div>

        {/* Stats - always above buttons */}
        <div className="flex items-center mb-6 py-4 px-4 bg-gray-50 rounded-lg group-hover:bg-orange-50/50 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {group.group_members?.length || 1} member{(group.group_members?.length || 1) !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Action buttons - pinned to bottom */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={handleViewGroup}
            className="flex-1 group/btn bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-sm font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>View</span>
            </span>
          </button>

          <button
            onClick={handleCopyInviteLink}
            className="group/invite bg-white border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 text-sm font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            title="Copy invite link"
          >
            <span className="flex items-center justify-center space-x-2">
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 transition-transform group-hover/invite:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Invite</span>
                </>
              )}
            </span>
          </button>

          {!isOwner && (
            <button
              onClick={handleLeaveGroup}
              disabled={isLeaving}
              className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Leave group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100/30 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-50/40 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
