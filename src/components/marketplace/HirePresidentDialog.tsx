"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface President {
  id: string;
  name: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  skills: string[];
  avatar: string;
}

interface HirePresidentDialogProps {
  president: President;
  onClose: () => void;
}

export default function HirePresidentDialog({ president, onClose }: HirePresidentDialogProps) {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user groups - in a real app, this would come from an API
  const userGroups = [
    { id: "1", name: "College Friends" },
    { id: "2", name: "Hiking Buddies" },
    { id: "3", name: "Book Club" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would send the hire request to your backend
    console.log("Hiring president:", {
      presidentId: president.id,
      groupId: selectedGroup,
      message,
    });

    alert(`Successfully sent hire request to ${president.name}!`);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Hire {president.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* President Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-white font-bold">
                {president.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{president.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">
                    {president.rating} ({president.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-[var(--primary)]">Starts from ${president.hourlyRate}</div>
          </div>

          {/* Hire Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
                Select Group
              </label>
              <select
                id="group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              >
                <option value="">Choose a group...</option>
                {userGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell the president about your group and what kind of events you're looking for..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your hire request will be sent to {president.name}</li>
                <li>• They'll review your group and respond within 24 hours</li>
                <li>• If accepted, you can start coordinating events together</li>
                <li>• Payment is processed securely through our platform</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedGroup || isSubmitting}
                className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Hire Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
