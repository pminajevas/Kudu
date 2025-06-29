import { useState, useEffect } from "react";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
}

interface EditActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  activity: Activity | null;
  onActivityUpdated: (activity: Activity) => void;
  onActivityDeleted: (activityId: string) => void;
}

export default function EditActivityDialog({ isOpen, onClose, groupId, activity, onActivityUpdated, onActivityDeleted }: EditActivityDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when activity changes
  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDescription(activity.description);
      setEventDate(activity.eventDate || "");
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`/api/groups/${groupId}/activities/${activity.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventDate: eventDate || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onActivityUpdated(data.activity);
        onClose();
      } else {
        setError(data.error || "Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      setError("An error occurred while updating the activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activity) return;

    if (!confirm(`Are you sure you want to delete "${activity.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`/api/groups/${groupId}/activities/${activity.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        onActivityDeleted(activity.id);
        onClose();
      } else {
        setError(data.error || "Failed to delete activity");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      setError("An error occurred while deleting the activity");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isLoading && !isDeleting) {
      onClose();
      setError(null);
    }
  };

  if (!activity) return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Edit Activity">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div>
          <Input label="Title *" type="text" value={title} onChange={(value) => setTitle(value)} placeholder="Enter activity title" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter activity description (optional)"
            disabled={isLoading || isDeleting}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            disabled={isLoading || isDeleting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="danger" onClick={handleDelete} disabled={isLoading || isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading || isDeleting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isDeleting || !title.trim()}>
              {isLoading ? "Updating..." : "Update Activity"}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
