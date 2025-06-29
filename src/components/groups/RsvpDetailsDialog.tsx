import { useState, useEffect } from "react";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

interface RsvpUser {
  response: "yes" | "no";
  userName: string;
  userId: string;
  createdAt: string;
}

interface RsvpDetails {
  yes: RsvpUser[];
  no: RsvpUser[];
  totalYes: number;
  totalNo: number;
}

interface RsvpDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  activityId: string;
  activityTitle: string;
}

export default function RsvpDetailsDialog({ isOpen, onClose, groupId, activityId, activityTitle }: RsvpDetailsDialogProps) {
  const [rsvpDetails, setRsvpDetails] = useState<RsvpDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activityId) {
      fetchRsvpDetails();
    }
  }, [isOpen, activityId]);

  const fetchRsvpDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`/api/groups/${groupId}/activities/${activityId}/rsvps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRsvpDetails(data);
      } else {
        setError("Failed to load RSVP details");
      }
    } catch (error) {
      console.error("Error fetching RSVP details:", error);
      setError("An error occurred while loading RSVP details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`RSVPs for "${activityTitle}"`}>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <p>Loading RSVP details...</p>
          </div>
        ) : rsvpDetails ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">✓ Going: {rsvpDetails.totalYes}</span>
                <span className="text-red-600 font-medium">✗ Not Going: {rsvpDetails.totalNo}</span>
              </div>
            </div>

            {/* Going List */}
            {rsvpDetails.yes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-green-700 mb-3">
                  ✓ Going ({rsvpDetails.totalYes})
                </h3>
                <div className="space-y-2">
                  {rsvpDetails.yes.map((user) => (
                    <div key={user.userId} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                      <span className="text-sm font-medium text-gray-900">{user.userName}</span>
                      <span className="text-xs text-gray-500">RSVP'd {formatDate(user.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Not Going List */}
            {rsvpDetails.no.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-red-700 mb-3">
                  ✗ Not Going ({rsvpDetails.totalNo})
                </h3>
                <div className="space-y-2">
                  {rsvpDetails.no.map((user) => (
                    <div key={user.userId} className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                      <span className="text-sm font-medium text-gray-900">{user.userName}</span>
                      <span className="text-xs text-gray-500">RSVP'd {formatDate(user.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No RSVPs */}
            {rsvpDetails.totalYes === 0 && rsvpDetails.totalNo === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No RSVPs yet</p>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
