"use client";

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

interface PresidentCardProps {
  president: President;
  onHireClick: () => void;
  showLoginPrompt: boolean;
}

export default function PresidentCard({ president, onHireClick, showLoginPrompt }: PresidentCardProps) {
  const { id, name, bio, rating, reviewCount, skills, bundles } = president;

  // Get the lowest priced active bundle
  const activeBundles = bundles?.filter((bundle) => bundle.isActive) || [];
  const lowestBundlePrice = activeBundles.length > 0 ? Math.min(...activeBundles.map((bundle) => bundle.price)) : null;

  const handleCardClick = () => {
    window.location.href = `/marketplace/president/${id}`;
  };

  const handleHireClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when hire button is clicked
    onHireClick();
  };

  return (
    <div onClick={handleCardClick} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:scale-105 cursor-pointer relative group">
      {/* Click indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center justify-center">
          <span className="text-[var(--primary)] text-xl font-bold">→</span>
        </div>
      </div>
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-white text-xl font-bold">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
              <span className="text-sm text-gray-500 ml-1">({reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{bio}</p>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium rounded-full">
              {skill}
            </span>
          ))}
          {skills.length > 3 && <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">+{skills.length - 3} more</span>}
        </div>
      </div>

      {/* Rate and Hire Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          {lowestBundlePrice ? (
            <div>
              <span className="text-sm text-gray-500">Starts from:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--primary)]">${lowestBundlePrice}</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-sm text-gray-500">Contact for pricing</span>
            </div>
          )}
        </div>
        <button onClick={handleCardClick} className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white hover:scale-105 px-6 py-2 rounded-lg font-medium transition-all duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
}
