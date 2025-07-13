"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import AuthContainer from "../../components/auth/AuthContainer";
import GroupDashboard from "../../components/groups/GroupDashboard";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Unify auth state from different sources
  useEffect(() => {
    const syncAuth = async () => {
      // Priority 1: NextAuth session
      if (session?.user) {
        try {
          // Fetch a custom token from the NextAuth session
          const response = await fetch("/api/auth/session");
          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user);
            setAuthToken(data.token);
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
            setMessage(`Welcome, ${data.user.name}!`);
          } else {
            // Handle case where session is valid but token generation fails
            console.error("Failed to fetch custom token from session");
            setMessage("Could not sync your session. Please try logging out and back in.");
          }
        } catch (error) {
          console.error("Error fetching session token:", error);
        }
        return; // Stop further checks
      }

      // Priority 2: Local storage token
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");
      if (storedToken && storedUser) {
        setAuthToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
        return; // Stop further checks
      }

      // Priority 3: No user found
      setCurrentUser(null);
      setAuthToken("");
    };

    syncAuth();
  }, [session]);

  const handleRegister = async (data: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage(`Registration successful! Welcome, ${result.user.name}`);
        setCurrentUser(result.user);
        setAuthToken(result.token);
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("auth_user", JSON.stringify(result.user));

        // Check for redirect URL and navigate if present
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        }
      } else {
        setMessage(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      setMessage("Error during registration");
    }
  };

  const handleLogin = async (data: LoginData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage(`Login successful! Welcome back, ${result.user.name}`);
        setCurrentUser(result.user);
        setAuthToken(result.token);
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("auth_user", JSON.stringify(result.user));

        // Check for redirect URL and navigate if present
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        }
      } else {
        setMessage(`Login failed: ${result.error}`);
      }
    } catch (error) {
      setMessage("Error during login");
    }
  };

  const handleLogout = async () => {
    if (session) {
      // Sign out from NextAuth (Facebook)
      await signOut({ redirect: false });
    }

    // Clear local state and storage
    setCurrentUser(null);
    setAuthToken("");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setMessage("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      {currentUser ? (
        // Logged in view - show dashboard
        <div className="relative z-10">
          {/* Main Content */}
          <div className="flex items-center justify-center p-8">
            <div className="container mx-auto max-w-4xl">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">Welcome, {currentUser.name}!</h1>
                <p className="text-lg text-[var(--secondary)]">Ready to manage your groups and activities</p>
              </div>

              <GroupDashboard user={currentUser} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 min-h-screen">
          <AuthContainer onLogin={handleLogin} onRegister={handleRegister} />
        </div>
      )}
    </div>
  );
}
