"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import AuthContainer from "../../components/auth/AuthContainer";
import UserStatus from "../../components/auth/UserStatus";
import UsersList from "../../components/users/UsersList";
import Alert from "../../components/ui/Alert";

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
  const [users, setUsers] = useState<User[]>([]);
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setMessage("Please log in first to view users");
        return;
      }

      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setMessage("Users fetched successfully");
      } else {
        const error = await response.json();
        setMessage(`Error fetching users: ${error.error}`);
      }
    } catch (error) {
      setMessage("Error fetching users");
    }
  };

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
    setUsers([]);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setMessage("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-8">
      {currentUser ? (
        // Logged in view - show dashboard
        <div className="container mx-auto max-w-4xl">
          <UserStatus user={currentUser} onLogout={handleLogout} />

          {message && (
            <Alert variant="info" className="mb-6">
              {message}
            </Alert>
          )}

          <UsersList users={users} onRefresh={fetchUsers} isLoggedIn={!!currentUser} />
        </div>
      ) : (
        // Login/Register view
        <>
          {message && (
            <div className="w-full max-w-md mb-6">
              <Alert variant="info" className="text-sm">
                {message}
              </Alert>
            </div>
          )}

          <AuthContainer onLogin={handleLogin} onRegister={handleRegister} />
        </>
      )}
    </div>
  );
}
