import { useState } from "react";
import Dialog from "../ui/Dialog";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, description: string) => Promise<void>;
}

export default function CreateGroupDialog({ isOpen, onClose, onCreateGroup }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onCreateGroup(groupName.trim(), description.trim());
        setGroupName("");
        setDescription("");
        onClose();
      } catch (error) {
        // Error handling is done in the parent component
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setGroupName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Create New Group">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input label="Group Name" type="text" value={groupName} onChange={(value) => setGroupName(value)} placeholder="Enter group name" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-amber-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter group description (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting || !groupName.trim()}>
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
