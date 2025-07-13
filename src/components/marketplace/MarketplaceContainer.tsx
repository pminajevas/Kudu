"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PresidentCard from "./PresidentCard";
import HirePresidentDialog from "./HirePresidentDialog";

// Mock data for presidents - in a real app, this would come from an API
const mockPresidents = [
  {
    id: "1",
    name: "Sarah Chen",
    bio: "Event planning specialist with 5+ years organizing group activities and corporate events.",
    hourlyRate: 25,
    rating: 4.8,
    reviewCount: 127,
    skills: ["Event Planning", "Group Coordination", "Budget Management"],
    avatar: "/images/president1.jpg",
    bundles: [
      {
        id: "b1-1",
        title: "Night Out Planning",
        description: "Complete planning for a perfect night out including restaurant reservations, activity coordination, and group logistics.",
        price: 25,
        duration: "1 evening",
        tags: ["nightlife", "restaurants", "quick"],
        isActive: true,
      },
      {
        id: "b1-2",
        title: "Weekend Adventure Package",
        description: "Full weekend trip planning with accommodation research, activity booking, and detailed itinerary creation.",
        price: 75,
        duration: "1 weekend",
        tags: ["travel", "adventure", "comprehensive"],
        isActive: true,
      },
      {
        id: "b1-3",
        title: "Monthly Event Series",
        description: "Plan and coordinate 4 group events throughout the month with themes, venues, and ongoing group engagement.",
        price: 150,
        duration: "1 month",
        tags: ["ongoing", "series", "premium"],
        isActive: true,
      },
    ],
  },
  {
    id: "2",
    name: "Marcus Johnson",
    bio: "Professional project manager who loves bringing people together through memorable experiences.",
    hourlyRate: 30,
    rating: 4.9,
    reviewCount: 203,
    skills: ["Project Management", "Team Building", "Social Events"],
    avatar: "/images/president2.jpg",
    bundles: [
      {
        id: "b2-1",
        title: "Team Building Session",
        description: "Professional team building event with activities designed to strengthen group bonds and communication.",
        price: 100,
        duration: "1 day",
        tags: ["team-building", "professional", "structured"],
        isActive: true,
      },
      {
        id: "b2-2",
        title: "Event Management Complete",
        description: "End-to-end event management for special occasions including planning, coordination, and execution.",
        price: 200,
        duration: "1 week",
        tags: ["comprehensive", "special-events", "premium"],
        isActive: true,
      },
      {
        id: "b2-3",
        title: "Group Retreat Planning",
        description: "Complete retreat planning with location scouting, activity planning, and logistics coordination.",
        price: 300,
        duration: "2 weeks",
        tags: ["retreat", "comprehensive", "luxury"],
        isActive: false,
      },
    ],
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    bio: "Creative organizer specializing in outdoor adventures and unique group experiences.",
    hourlyRate: 28,
    rating: 4.7,
    reviewCount: 89,
    skills: ["Outdoor Events", "Adventure Planning", "Creative Activities"],
    avatar: "/images/president3.jpg",
    bundles: [
      {
        id: "b3-1",
        title: "Urban Adventure Hunt",
        description: "Custom scavenger hunt through the city with unique challenges and photo opportunities.",
        price: 45,
        duration: "1 day",
        tags: ["adventure", "urban", "creative"],
        isActive: true,
      },
      {
        id: "b3-2",
        title: "Outdoor Workshop Series",
        description: "Three creative outdoor workshops including photography, nature sketching, and outdoor cooking.",
        price: 120,
        duration: "3 days",
        tags: ["workshops", "creative", "outdoor"],
        isActive: true,
      },
    ],
  },
];

export default function MarketplaceContainer() {
  const { user } = useAuth();
  const [selectedPresident, setSelectedPresident] = useState<(typeof mockPresidents)[0] | null>(null);
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleHireClick = (president: (typeof mockPresidents)[0]) => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    setSelectedPresident(president);
    setShowHireDialog(true);
  };

  const handleCloseDialog = () => {
    setShowHireDialog(false);
    setSelectedPresident(null);
  };

  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] to-[#FFF9F5] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">President Marketplace</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and hire presidents to manage your group activities. Browse profiles, compare rates, and choose the perfect organizer for your friend group.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                if (user) {
                  window.location.href = "/marketplace/register-president";
                } else {
                  // Store the intended destination for after login
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("redirectAfterLogin", "/marketplace/register-president");
                  }
                  window.location.href = "/dashboard";
                }
              }}
              className="px-6 py-3 bg-[var(--secondary)] text-white rounded-lg hover:bg-[var(--primary)] transition-all duration-200 font-medium hover:scale-105"
            >
              🎯 Become a President
            </button>
            <span className="text-gray-400 hidden sm:inline">or</span>
            <span className="text-gray-600">Browse available presidents below</span>
          </div>

          {!user && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <p className="text-blue-800 text-sm">
                💡 <strong>Note:</strong> You need to be logged in to hire a president or register as one.
              </p>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search presidents by name or skills..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
              <option value="">All Rates</option>
              <option value="0-25">$0 - $25/hr</option>
              <option value="25-35">$25 - $35/hr</option>
              <option value="35+">$35+/hr</option>
            </select>
          </div>
        </div>

        {/* Presidents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPresidents.map((president) => (
            <PresidentCard key={president.id} president={president} onHireClick={() => handleHireClick(president)} showLoginPrompt={false} />
          ))}
        </div>

        {/* Empty State */}
        {mockPresidents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No presidents found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Hire Dialog */}
        {showHireDialog && selectedPresident && <HirePresidentDialog president={selectedPresident} onClose={handleCloseDialog} />}

        {/* Login Required Dialog */}
        {showLoginDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Login Required</h2>
                <button onClick={handleCloseLoginDialog} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                  ×
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600">You must be logged in to hire a president or purchase service bundles.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCloseLoginDialog} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
