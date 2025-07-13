"use client";

import BundleManager from "@/components/marketplace/BundleManager";

export default function ManageBundlesPage() {
  const handleBundlesChange = (bundles: any[]) => {
    // In a real app, this would save to the database
    console.log("Bundles updated:", bundles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] to-[#FFF9F5] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Manage Your Service Bundles</h1>
          <p className="text-gray-600">Create and manage fixed-price service packages for your clients. Bundles help you offer clear pricing and defined deliverables.</p>
        </div>

        <BundleManager
          crewCaptainId="current-user-id" // In a real app, this would come from auth
          onBundlesChange={handleBundlesChange}
        />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">Bundle Best Practices</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be specific about what's included in each bundle</li>
            <li>• Price bundles competitively compared to your hourly rate</li>
            <li>• Use clear durations (e.g., "1 day", "1 week", "2 weeks")</li>
            <li>• Add relevant tags to help clients find your services</li>
            <li>• Only activate bundles you can deliver consistently</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
