"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import HirePresidentDialog from "./HirePresidentDialog";

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
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  skills: string[];
  avatar: string;
  description?: string;
  portfolio?: string[];
  testimonials?: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  bundles?: Bundle[];
}

interface PresidentProfileProps {
  presidentId: string;
}

// Mock extended president data - in a real app, this would come from an API
const mockPresidentsData: Record<string, President> = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    bio: "Event planning specialist with 5+ years organizing group activities and corporate events.",
    description:
      "Sarah is a passionate event organizer who believes that great memories are made when people come together. With her background in hospitality management and a natural talent for bringing people together, she has successfully organized over 200 group events ranging from intimate dinner parties to large-scale outdoor adventures.\n\nHer approach combines meticulous planning with spontaneous fun, ensuring every event she organizes becomes a memorable experience. Sarah specializes in budget-friendly activities that maximize enjoyment while keeping costs reasonable for everyone involved.",
    hourlyRate: 25,
    rating: 4.8,
    reviewCount: 127,
    skills: ["Event Planning", "Group Coordination", "Budget Management", "Outdoor Activities", "Team Building"],
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
    portfolio: [
      "Organized monthly hiking trips for 15-person group (2 years)",
      "Coordinated weekly game nights for college alumni network",
      "Planned successful weekend camping trips with 25+ participants",
      "Managed budget and logistics for annual group vacation to Costa Rica",
    ],
    testimonials: [
      {
        id: "1",
        name: "Mike Rodriguez",
        rating: 5,
        comment: "Sarah made our group adventures so much more organized and fun! She thinks of everything.",
        date: "2024-11-15",
      },
      {
        id: "2",
        name: "Jessica Liu",
        rating: 5,
        comment: "Best decision we made was hiring Sarah. Our events went from chaotic to amazing.",
        date: "2024-10-22",
      },
      {
        id: "3",
        name: "Alex Thompson",
        rating: 4,
        comment: "Great organizer, always on budget and super reliable. Highly recommend!",
        date: "2024-09-30",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Marcus Johnson",
    bio: "Professional project manager who loves bringing people together through memorable experiences.",
    description:
      "Marcus brings his corporate project management expertise to the world of social events. With certifications in PMP and Agile methodologies, he applies proven organizational frameworks to ensure every group activity runs smoothly from conception to completion.\n\nWhat sets Marcus apart is his ability to balance structure with flexibility, creating events that feel spontaneous and fun while being meticulously planned behind the scenes. He excels at managing diverse groups and finding activities that appeal to everyone.",
    hourlyRate: 30,
    rating: 4.9,
    reviewCount: 203,
    skills: ["Project Management", "Team Building", "Social Events", "Conflict Resolution", "Timeline Management"],
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
    portfolio: [
      "Led project management for 50-person company retreat",
      "Organized quarterly team building events for tech startup (3 years)",
      "Coordinated multi-city bachelor party with 12 participants",
      "Managed logistics for annual charity fundraiser with 100+ attendees",
    ],
    testimonials: [
      {
        id: "1",
        name: "Sarah Kim",
        rating: 5,
        comment: "Marcus is incredibly professional and detail-oriented. Our events run like clockwork!",
        date: "2024-12-01",
      },
      {
        id: "2",
        name: "David Chen",
        rating: 5,
        comment: "He made organizing our friend group so much easier. Worth every penny!",
        date: "2024-11-18",
      },
    ],
  },
  "3": {
    id: "3",
    name: "Emma Rodriguez",
    bio: "Creative organizer specializing in outdoor adventures and unique group experiences.",
    description:
      "Emma is an adventure enthusiast who turned her passion for outdoor activities into a career helping others explore the world around them. With certifications in wilderness first aid and outdoor leadership, she specializes in creating safe, exciting, and memorable outdoor experiences.\n\nHer creative approach to event planning means no two activities are ever the same. Emma loves finding hidden gems and unique experiences that groups will talk about for years to come.",
    hourlyRate: 28,
    rating: 4.7,
    reviewCount: 89,
    skills: ["Outdoor Events", "Adventure Planning", "Creative Activities", "Wilderness Safety", "Photography"],
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
    portfolio: [
      "Guided weekend backpacking trips for 8-person group",
      "Organized unique urban scavenger hunts with photo challenges",
      "Planned creative workshop series (pottery, cooking, art)",
      "Led nature photography expeditions to national parks",
    ],
    testimonials: [
      {
        id: "1",
        name: "Tyler Jones",
        rating: 5,
        comment: "Emma introduced us to activities we never would have tried. Amazing experiences!",
        date: "2024-10-15",
      },
      {
        id: "2",
        name: "Rachel Green",
        rating: 4,
        comment: "Creative and fun! She always finds the coolest places and activities.",
        date: "2024-09-20",
      },
    ],
  },
};

export default function PresidentProfile({ presidentId }: PresidentProfileProps) {
  const { user } = useAuth();
  const [president, setPresident] = useState<President | null>(null);
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [showBundleDialog, setShowBundleDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPresident = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
      const presidentData = mockPresidentsData[presidentId];
      setPresident(presidentData || null);
      setLoading(false);
    };

    fetchPresident();
  }, [presidentId]);

  const handleHireClick = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    setShowHireDialog(true);
  };

  const findCheapestBundle = (bundles: Bundle[] | undefined) => {
    if (!bundles || bundles.length === 0) return null;
    return bundles.reduce((cheapest, current) => {
      return current.isActive && current.price < cheapest.price ? current : cheapest;
    }, bundles[0]);
  };

  const handleBundleHire = (bundle: Bundle) => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    setSelectedBundle(bundle);
    setShowBundleDialog(true);
  };

  const handleCloseDialog = () => {
    setShowHireDialog(false);
  };

  const handleCloseBundleDialog = () => {
    setShowBundleDialog(false);
    setSelectedBundle(null);
  };

  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--background)] to-[#FFF9F5] flex items-center justify-center">
        <div className="text-2xl text-[var(--primary)]">Loading...</div>
      </div>
    );
  }

  if (!president) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--background)] to-[#FFF9F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">President Not Found</h1>
          <p className="text-gray-600 mb-6">The president you're looking for doesn't exist.</p>
          <a href="/marketplace" className="text-[var(--primary)] hover:underline">
            ← Back to Marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] to-[#FFF9F5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <a href="/marketplace" className="inline-flex items-center text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
            ← Back to Marketplace
          </a>
        </div>

        {/* Main Layout - Two Column on Large Screens */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="w-32 h-32 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {president.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{president.name}</h1>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-xl">★</span>
                          <span className="text-lg font-medium text-gray-700 ml-1">{president.rating}</span>
                          <span className="text-gray-500 ml-1">({president.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-[var(--primary)] mb-2 whitespace-nowrap">Starts from ${findCheapestBundle(president.bundles)?.price || president.hourlyRate}</div>
                      <button
                        onClick={handleHireClick}
                        className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white hover:scale-105 px-8 py-3 rounded-lg font-medium transition-all duration-200"
                      >
                        Hire Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 text-lg leading-relaxed">{president.bio}</p>
            </div>

            {/* Service Bundles - Mobile Only */}
            {president.bundles && president.bundles.filter((bundle) => bundle.isActive).length > 0 && (
              <div className="lg:hidden bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Service Bundles</h2>
                  <span className="text-sm text-gray-500">Fixed-price packages</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {president.bundles
                    .filter((bundle) => bundle.isActive)
                    .map((bundle) => (
                      <div key={bundle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{bundle.title}</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[var(--primary)]">${bundle.price}</div>
                            <div className="text-sm text-gray-500">{bundle.duration}</div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{bundle.description}</p>
                        {bundle.tags && bundle.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {bundle.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => handleBundleHire(bundle)}
                          className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white"
                        >
                          Hire This Bundle
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {president.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            {president.description && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About {president.name}</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{president.description}</div>
              </div>
            )}

            {/* Portfolio */}
            {president.portfolio && president.portfolio.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Highlights</h2>
                <ul className="space-y-3">
                  {president.portfolio.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Testimonials */}
            {president.testimonials && president.testimonials.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What Clients Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {president.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{new Date(testimonial.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mb-3">"{testimonial.comment}"</p>
                      <p className="text-sm font-medium text-gray-800">- {testimonial.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Service Bundles Sidebar - Large Screens Only */}
          {president.bundles && president.bundles.filter((bundle) => bundle.isActive).length > 0 && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Service Bundles</h2>
                    <span className="text-xs text-gray-500">Fixed-price</span>
                  </div>
                  <div className="space-y-4">
                    {president.bundles
                      .filter((bundle) => bundle.isActive)
                      .map((bundle) => (
                        <div key={bundle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="mb-3">
                            <h3 className="text-base font-semibold text-gray-800 mb-1">{bundle.title}</h3>
                            <div className="flex items-center justify-between">
                              <div className="text-xl font-bold text-[var(--primary)]">${bundle.price}</div>
                              <div className="text-xs text-gray-500">{bundle.duration}</div>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3 text-xs leading-relaxed">{bundle.description}</p>
                          {bundle.tags && bundle.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {bundle.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {bundle.tags.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{bundle.tags.length - 3}</span>}
                            </div>
                          )}
                          <button
                            onClick={() => handleBundleHire(bundle)}
                            className="w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white"
                          >
                            Hire This Bundle
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hire Dialog */}
        {showHireDialog && president && <HirePresidentDialog president={president} onClose={handleCloseDialog} />}

        {/* Bundle Hire Dialog */}
        {showBundleDialog && selectedBundle && president && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Hire Bundle</h2>
                <button onClick={handleCloseBundleDialog} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">{selectedBundle.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{selectedBundle.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[var(--primary)]">${selectedBundle.price}</span>
                    <span className="text-sm text-gray-500">{selectedBundle.duration}</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">What happens next:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Payment will be processed securely</li>
                    <li>• {president.name} will be notified immediately</li>
                    <li>• Work begins within 24 hours</li>
                    <li>• Full refund if not satisfied</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCloseBundleDialog} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would integrate with a payment processor
                      alert(`Payment flow for ${selectedBundle.title} ($${selectedBundle.price}) would start here!`);
                      handleCloseBundleDialog();
                    }}
                    className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors"
                  >
                    Pay ${selectedBundle.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
