"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

export default function NavBar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    // Sign out from NextAuth if using social login
    await signOut({ redirect: false });

    // Clear local state and storage using the auth hook
    logout();

    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <header className="flex items-center justify-between sm:sticky top-0 left-0 w-full px-4 sm:px-8 py-4 z-50 bg-gradient-to-r from-[var(--background)]/80 via-[#FFF9F5]/80 to-[#FFFDF8]/80 backdrop-blur-sm border-b border-[var(--primary)] border-opacity-10 animate-fadeInUp">
      <h1 className="ml-0 sm:ml-[80px] text-2xl sm:text-4xl font-poppins font-bold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-300 cursor-pointer hover-scale">
        <a href="/">Kudu</a>
      </h1>

      <nav className="flex items-center gap-6">
        <a href="/marketplace" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200">
          Find Presidents
        </a>

        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-[var(--secondary)] bg-white/30 hover:bg-[var(--primary)] hover:text-[var(--button-text)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-1 rounded-md transition-colors duration-200 shadow-sm border border-[var(--primary)]/20 backdrop-blur-sm"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
