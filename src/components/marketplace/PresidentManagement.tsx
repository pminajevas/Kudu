"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  tags?: string[];
  isActive: boolean;
}

interface President {
  id: string;
  name: string;
  bio: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  avatar: string;
  bundles?: Bundle[];
}

interface PresidentManagementProps {
  presidentId: string;
}

export default function PresidentManagement({ presidentId }: PresidentManagementProps) {
  const searchParams = useSearchParams();
  const isNewRegistration = searchParams?.get("newRegistration") === "true";

  const [president, setPresident] = useState<President | null>(null);
  const [isEditing, setIsEditing] = useState(isNewRegistration);
  const [loading, setLoading] = useState(true);

  // Mock data for demo - in a real app, this would fetch from API
  useEffect(() => {
    const mockPresident: President = {
      id: presidentId,
      name: "New President",
      bio: "Your bio will appear here",
      rating: 0,
      reviewCount: 0,
      skills: [],
      avatar: "",
      bundles: [],
    };

    setPresident(mockPresident);
    setLoading(false);
  }, [presidentId]);

  const handleSave = () => {
    // TODO: Save changes to API
    console.log("Saving president data:", president);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!president) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">President not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to Marketplace Link */}
        <div className="mb-4">
          <button onClick={() => (window.location.href = "/marketplace")} className="text-[var(--primary)] hover:text-[var(--secondary)] font-medium flex items-center gap-2">
            ← Back to Marketplace
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          {isNewRegistration && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              🎉 Congratulations! You've successfully registered as a President. Your profile is now live!
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isEditing ? "Manage Your Profile" : "President Profile"}</h1>
          <p className="text-gray-600">{isEditing ? "Update your information and service bundles" : "Your president profile and services"}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {president.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{president.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>
                    ⭐ {president.rating}/5 ({president.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-gray-600">{president.bio || "No bio provided yet"}</p>
              </div>
            </div>

            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors">
                Edit Profile
              </button>
            )}
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {president.skills.length > 0 ? (
                president.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No skills added yet</span>
              )}
            </div>
          </div>

          {/* Service Bundles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Bundles</h3>
            {president.bundles && president.bundles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {president.bundles.map((bundle) => (
                  <div key={bundle.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{bundle.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${bundle.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {bundle.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{bundle.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[var(--primary)]">${bundle.price}</span>
                      <span className="text-gray-500">{bundle.duration}</span>
                    </div>
                    {bundle.tags && bundle.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {bundle.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No service bundles created yet</p>
                <button onClick={() => setIsEditing(true)} className="mt-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors">
                  Add Your First Bundle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-4">
            <button onClick={handleCancel} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors">
              Save Changes
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Profile Views</h4>
            <p className="text-2xl font-bold text-[var(--primary)]">0</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Active Bundles</h4>
            <p className="text-2xl font-bold text-[var(--primary)]">{president.bundles?.filter((b) => b.isActive).length || 0}</p>
            <p className="text-sm text-gray-500">Available for hire</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Total Earnings</h4>
            <p className="text-2xl font-bold text-[var(--primary)]">$0</p>
            <p className="text-sm text-gray-500">All time</p>
          </div>
        </div>

        {/* Tips for New Presidents */}
        {isNewRegistration && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Tips to Get Started</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Complete your profile with a detailed bio and skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Create compelling service bundles with clear descriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Set competitive prices based on your experience</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
