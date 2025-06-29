import { useState } from "react";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CreateActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onActivityCreated: (activity: any) => void;
}

export default function CreateActivityDialog({ isOpen, onClose, groupId, onActivityCreated }: CreateActivityDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`/api/groups/${groupId}/activities`, {
        method: "POST",
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
        onActivityCreated(data.activity);
        onClose();
        // Reset form
        setTitle("");
        setDescription("");
        setEventDate("");
      } else {
        setError(data.error || "Failed to create activity");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      setError("An error occurred while creating the activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setError(null);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Create New Activity">
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
            disabled={isLoading}
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
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !title.trim()}>
            {isLoading ? "Creating..." : "Create Activity"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
