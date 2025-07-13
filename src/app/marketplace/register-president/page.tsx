"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import PresidentRegistrationForm from "../../../components/marketplace/PresidentRegistrationForm";

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

export default function RegisterPresidentPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!loading && !user) {
      // Store the intended destination for after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', '/marketplace/register-president');
      }
    }
  }, [user, loading]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-semibold text-gray-800 mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-6">You need to be logged in to register as a Crew Captain.</p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors"
                >
                  Log In
                </button>
                <button onClick={() => router.push("/marketplace")} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Back to Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (presidentData: Omit<President, "id" | "rating" | "reviewCount">) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call to save president data
      console.log("Submitting president data:", presidentData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a temporary ID for demo purposes
      const newPresidentId = `president-${Date.now()}`;

      // Redirect to president profile management page
      router.push(`/marketplace/president/${newPresidentId}?newRegistration=true`);
    } catch (error) {
      console.error("Error registering president:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to Marketplace Link */}
        <div className="mb-4">
          <button onClick={() => router.push("/marketplace")} className="text-[var(--primary)] hover:text-[var(--secondary)] font-medium flex items-center gap-2">
            ← Back to Marketplace
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register as a President</h1>
          <p className="text-gray-600">Offer your services as a group organizer and help communities thrive</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <PresidentRegistrationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
