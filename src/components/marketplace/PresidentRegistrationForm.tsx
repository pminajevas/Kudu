"use client";

import { useState } from "react";

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

interface PresidentRegistrationFormProps {
  onSubmit: (data: Omit<President, "id" | "rating" | "reviewCount">) => void;
  isSubmitting: boolean;
}

export default function PresidentRegistrationForm({ onSubmit, isSubmitting }: PresidentRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
    skills: [] as string[],
  });

  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: `bundle-${Date.now()}`,
      title: "",
      description: "",
      price: 0,
      duration: "",
      tags: [],
      isActive: true,
    },
  ]);

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddBundle = () => {
    setBundles((prev) => [
      ...prev,
      {
        id: `bundle-${Date.now()}`,
        title: "",
        description: "",
        price: 0,
        duration: "",
        tags: [],
        isActive: true,
      },
    ]);
  };

  const handleRemoveBundle = (bundleId: string) => {
    setBundles((prev) => prev.filter((bundle) => bundle.id !== bundleId));
  };

  const handleBundleChange = (bundleId: string, field: keyof Bundle, value: any) => {
    setBundles((prev) => prev.map((bundle) => (bundle.id === bundleId ? { ...bundle, [field]: value } : bundle)));
  };

  const handleBundleTagChange = (bundleId: string, tagInput: string) => {
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    handleBundleChange(bundleId, "tags", tags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    const validBundles = bundles.filter((bundle) => bundle.title.trim() && bundle.description.trim() && bundle.duration.trim());

    if (validBundles.length === 0) {
      alert("At least one valid bundle is required");
      return;
    }

    const presidentData = {
      ...formData,
      bundles: validBundles,
    };

    onSubmit(presidentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL (optional)</label>
          <input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio (optional)</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="Tell potential clients about yourself and your experience..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="Add a skill and press Enter"
            />
            <button type="button" onClick={handleAddSkill} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full flex items-center gap-2">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bundles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 flex-1">Service Bundles</h2>
          <button type="button" onClick={handleAddBundle} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Add Bundle
          </button>
        </div>

        {bundles.map((bundle, index) => (
          <div key={bundle.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">Bundle {index + 1}</h3>
              {bundles.length > 1 && (
                <button type="button" onClick={() => handleRemoveBundle(bundle.id)} className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bundle.title}
                  onChange={(e) => handleBundleChange(bundle.id, "title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="e.g., Event Planning Package"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bundle.duration}
                  onChange={(e) => handleBundleChange(bundle.id, "duration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="e.g., 1 week, 2 months"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={bundle.price || ""}
                  onChange={(e) => handleBundleChange(bundle.id, "price", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={bundle.description}
                onChange={(e) => handleBundleChange(bundle.id, "description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Describe what's included in this bundle..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
              <input
                type="text"
                value={bundle.tags?.join(", ") || ""}
                onChange={(e) => handleBundleTagChange(bundle.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="event planning, networking, team building (comma separated)"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            isSubmitting ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-[var(--primary)] hover:bg-[var(--secondary)] text-white hover:scale-105"
          }`}
        >
          {isSubmitting ? "Registering..." : "Register as President"}
        </button>
      </div>
    </form>
  );
}
