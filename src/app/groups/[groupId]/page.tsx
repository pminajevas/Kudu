"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CreateActivityDialog from "@/components/groups/CreateActivityDialog";
import EditActivityDialog from "@/components/groups/EditActivityDialog";
import RsvpDetailsDialog from "@/components/groups/RsvpDetailsDialog";

interface GroupMember {
  userId: string;
  role: string;
  joinedAt: string;
  email: string;
  fullName: string;
}

interface GroupDetails {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  invite_link: string;
  userRole: string;
  members: GroupMember[];
}

interface Activity {
  id: string;
  title: string;
  description: string;
  eventDate?: string;
  author: string;
  timestamp: string;
  updatedAt?: string;
  createdBy?: string;
  isOwner?: boolean;
  rsvpYesCount?: number;
  rsvpNoCount?: number;
  totalRsvpCount?: number;
  userRsvp?: "yes" | "no" | null;
}

interface President {
  userId: string;
  name: string;
  email: string;
  weekStartDate: string;
  weekEndDate: string;
}

export default function GroupDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [president, setPresident] = useState<President | null>(null);
  const [isCurrentUserPresident, setIsCurrentUserPresident] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingPresident, setLoadingPresident] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showEditActivity, setShowEditActivity] = useState(false);
  const [showRsvpDetails, setShowRsvpDetails] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        console.log("Frontend - Fetching group details for ID:", groupId);

        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(`/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Frontend - Response status:", response.status);
        const data = await response.json();
        console.log("Frontend - Response data:", data);

        if (response.ok) {
          setGroupDetails(data);
        } else {
          setError(data.error || "Failed to load group details");
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
        setError("An error occurred while loading the group");
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await fetch(`/api/groups/${groupId}/activities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const activitiesData = await response.json();
          setActivities(activitiesData);
        } else {
          console.error("Failed to fetch activities");
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    const fetchPresident = async () => {
      try {
        console.log("Frontend - Fetching president for group:", groupId);
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await fetch(`/api/groups/${groupId}/president`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Frontend - President API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Frontend - President data received:", data);
          setPresident(data.president);
          setIsCurrentUserPresident(data.isCurrentUserPresident);
          console.log("Frontend - President state updated:", data.president);
          console.log("Frontend - Is current user president:", data.isCurrentUserPresident);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch president information:", errorData);
        }
      } catch (error) {
        console.error("Error fetching president:", error);
      } finally {
        setLoadingPresident(false);
      }
    };

    if (groupId) {
      fetchGroupDetails();
      fetchActivities();
      fetchPresident();
    }
  }, [groupId, router]);

  const handleCopyInviteLink = async () => {
    if (!groupDetails) return;

    try {
      const inviteUrl = `${window.location.origin}/join/${groupDetails.invite_link}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  const handleActivityCreated = (newActivity: Activity) => {
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleActivityUpdated = (updatedActivity: Activity) => {
    setActivities((prev) => prev.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity)));
  };

  const handleActivityDeleted = (activityId: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
  };

  const handleActivityClick = (activity: Activity) => {
    if (activity.isOwner) {
      setSelectedActivity(activity);
      setShowEditActivity(true);
    }
  };

  const handleViewRsvps = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowRsvpDetails(true);
  };

  const handleRsvp = async (activityId: string, response: "yes" | "no") => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const apiResponse = await fetch(`/api/groups/${groupId}/activities/${activityId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ response }),
      });

      if (apiResponse.ok) {
        // Refresh activities to get updated RSVP counts
        const activitiesResponse = await fetch(`/api/groups/${groupId}/activities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setActivities(activitiesData);
        }
      } else {
        console.error("Failed to save RSVP");
      }
    } catch (error) {
      console.error("Error saving RSVP:", error);
    }
  };

  const handleRemoveRsvp = async (activityId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const apiResponse = await fetch(`/api/groups/${groupId}/activities/${activityId}/rsvp`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (apiResponse.ok) {
        // Refresh activities to get updated RSVP counts
        const activitiesResponse = await fetch(`/api/groups/${groupId}/activities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setActivities(activitiesData);
        }
      } else {
        console.error("Failed to remove RSVP");
      }
    } catch (error) {
      console.error("Error removing RSVP:", error);
    }
  };

  const getRoleColor = (role: string) => {
    return role === "owner" ? "bg-[var(--background)] text-[var(--primary)] border border-[var(--primary)]/20" : "bg-[var(--secondary)]/10 text-[var(--secondary)]";
  };

  const formatEventDateTime = (activity: Activity) => {
    if (!activity.eventDate) return null;

    const date = new Date(activity.eventDate);
    return date.toLocaleDateString();
  };

  // Debug logging
  console.log("Debug - Component render:", {
    loadingPresident,
    president,
    isCurrentUserPresident,
    groupId,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8 text-[var(--secondary)]">Loading group details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!groupDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm border-b border-purple-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-purple-700 truncate">{groupDetails.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(groupDetails.userRole)} self-start`}>{groupDetails.userRole}</span>
              </div>
              {groupDetails.description && <p className="text-purple-600 text-sm sm:text-base break-words">{groupDetails.description}</p>}
              <p className="text-sm text-purple-500 mt-1">
                Created {new Date(groupDetails.created_at).toLocaleDateString()} • {groupDetails.members.length} members
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
              <Button onClick={handleCopyInviteLink} variant="secondary" size="sm">
                {copied ? "Copied!" : "Share Invite"}
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="secondary" size="sm">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* President Section */}
            <Card>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">👑</span>
                  Weekly President
                </h2>
                {loadingPresident ? (
                  <div className="text-center py-4 text-purple-600">
                    <p>Loading president info...</p>
                  </div>
                ) : president ? (
                  <div className="space-y-3">
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        isCurrentUserPresident ? "bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-300 shadow-lg" : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">👑</span>
                        <span className={`font-bold text-lg ${isCurrentUserPresident ? "text-purple-800" : "text-gray-700"}`}>{president.name}</span>
                        {isCurrentUserPresident && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md">YOU</span>}
                      </div>
                      <p className={`text-sm ${isCurrentUserPresident ? "text-purple-600" : "text-gray-600"} mb-1`}>{president.email}</p>
                      <p className={`text-xs ${isCurrentUserPresident ? "text-purple-500" : "text-gray-500"}`}>
                        Term: {new Date(president.weekStartDate).toLocaleDateString()} - {new Date(president.weekEndDate).toLocaleDateString()}
                      </p>
                      {isCurrentUserPresident && <p className="text-sm text-purple-700 mt-3 font-semibold bg-purple-50 px-3 py-1 rounded-md">✨ You can create activities this week!</p>}
                    </div>
                    <div className="text-xs text-indigo-700 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <p className="font-semibold mb-2 text-indigo-800 flex items-center gap-1">
                        <span>ℹ️</span>
                        About the President System:
                      </p>
                      <p className="leading-relaxed">Each week, a new president is randomly selected from group members. Only the current president can create new activities.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-purple-600">
                    <p>No president assigned for this week</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Members Section */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-[var(--primary)] mb-4">Members ({groupDetails.members.length})</h2>
                <div className="space-y-3">
                  {groupDetails.members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg border border-[var(--primary)]/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[var(--primary)]">{member.fullName}</p>
                          {president?.userId === member.userId && (
                            <span className="text-lg" title="Current President">
                              👑
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--secondary)]">{member.email}</p>
                        <p className="text-xs text-[var(--secondary)]/70">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Activities Section */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--primary)]">Recent Activities</h2>
                  {isCurrentUserPresident ? (
                    <Button size="sm" onClick={() => setShowCreateActivity(true)}>
                      New Activity
                    </Button>
                  ) : (
                    <div className="text-right">
                      <div title="Only the current president can create activities">
                        <Button size="sm" disabled>
                          New Activity
                        </Button>
                      </div>
                      <p className="text-xs text-[var(--secondary)] mt-1">Only {president?.name || "the president"} can create activities</p>
                    </div>
                  )}
                </div>

                {loadingActivities ? (
                  <div className="text-center py-8 text-[var(--secondary)]">
                    <p>Loading activities...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity: Activity) => (
                      <div
                        key={activity.id}
                        className={`border border-[var(--primary)]/20 rounded-lg p-4 transition-shadow ${
                          activity.isOwner ? "hover:shadow-md cursor-pointer bg-[var(--background)] border-[var(--primary)]/30" : "hover:shadow-sm bg-[var(--background-secondary)]"
                        }`}
                        onClick={activity.isOwner ? () => handleActivityClick(activity) : undefined}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-[var(--primary)]">{activity.title}</h3>
                            {activity.isOwner && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--background)] text-[var(--primary)] border border-[var(--primary)]/20">
                                Owner
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[var(--secondary)] text-sm mb-2 whitespace-pre-wrap">{activity.description}</p>

                        {/* Event Date/Time */}
                        {formatEventDateTime(activity) && (
                          <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--secondary)]/10 text-[var(--secondary)]">
                              📅 {formatEventDateTime(activity)}
                            </span>
                          </div>
                        )}

                        {/* RSVP Section */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-[var(--secondary)]">
                            <span>By {activity.author}</span>
                            {(activity.rsvpYesCount! > 0 || activity.rsvpNoCount! > 0) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewRsvps(activity);
                                }}
                                className="flex gap-2 hover:text-[var(--primary)] cursor-pointer"
                                title="View RSVP details"
                              >
                                <span className="text-green-600">✓ {activity.rsvpYesCount}</span>
                                <span className="text-red-600">✗ {activity.rsvpNoCount}</span>
                              </button>
                            )}
                          </div>

                          {/* RSVP Buttons */}
                          {!activity.isOwner && (
                            <div className="flex gap-1">
                              {activity.userRsvp === "yes" ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveRsvp(activity.id);
                                  }}
                                  className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  ✓ Going
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRsvp(activity.id, "yes");
                                  }}
                                  className="px-2 py-1 text-xs bg-[var(--background)] text-[var(--secondary)] border border-[var(--primary)]/20 rounded hover:bg-green-500 hover:text-white hover:border-green-500"
                                >
                                  ✓ Yes
                                </button>
                              )}

                              {activity.userRsvp === "no" ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveRsvp(activity.id);
                                  }}
                                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  ✗ Not Going
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRsvp(activity.id, "no");
                                  }}
                                  className="px-2 py-1 text-xs bg-[var(--background)] text-[var(--secondary)] border border-[var(--primary)]/20 rounded hover:bg-red-500 hover:text-white hover:border-red-500"
                                >
                                  ✗ No
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {activities.length === 0 && (
                      <div className="text-center py-8 text-[var(--secondary)]">
                        <p>No activities yet. Create your first activity to get started!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <CreateActivityDialog isOpen={showCreateActivity} onClose={() => setShowCreateActivity(false)} groupId={groupId} onActivityCreated={handleActivityCreated} />

      <EditActivityDialog
        isOpen={showEditActivity}
        onClose={() => setShowEditActivity(false)}
        groupId={groupId}
        activity={selectedActivity}
        onActivityUpdated={handleActivityUpdated}
        onActivityDeleted={handleActivityDeleted}
      />

      <RsvpDetailsDialog isOpen={showRsvpDetails} onClose={() => setShowRsvpDetails(false)} groupId={groupId} activityId={selectedActivity?.id || ""} activityTitle={selectedActivity?.title || ""} />
    </div>
  );
}
