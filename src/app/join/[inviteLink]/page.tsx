"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import AuthContainer from "../../../components/auth/AuthContainer";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function JoinGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState("");

  const inviteLink = params.inviteLink as string;

  // Check authentication state
  useEffect(() => {
    const checkAuth = async () => {
      // Check for NextAuth session
      if (session?.user) {
        try {
          const response = await fetch("/api/auth/session");
          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user);
            setAuthToken(data.token);
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
          }
        } catch (error) {
          console.error("Error fetching session token:", error);
        }
        return;
      }

      // Check local storage
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");
      if (storedToken && storedUser) {
        setAuthToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      }
    };

    checkAuth();
  }, [session]);

  // Fetch group information
  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!inviteLink) return;

      try {
        const response = await fetch(`/api/groups/join/${inviteLink}`);
        const result = await response.json();

        if (response.ok) {
          setGroup(result.group);
        } else {
          setMessage(result.error || "Invalid invite link");
        }
      } catch (error) {
        setMessage("Failed to load group information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupInfo();
  }, [inviteLink]);

  const handleJoinGroup = async () => {
    if (!currentUser || !authToken || !group) return;

    setIsJoining(true);
    setMessage("");

    try {
      const response = await fetch(`/api/groups/join/${inviteLink}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Successfully joined "${group.name}"!`);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setMessage(result.error || "Failed to join group");
      }
    } catch (error) {
      setMessage("An error occurred while joining the group");
    } finally {
      setIsJoining(false);
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
        setCurrentUser(result.user);
        setAuthToken(result.token);
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("auth_user", JSON.stringify(result.user));
        setMessage(`Login successful! Welcome back, ${result.user.name}`);
      } else {
        setMessage(`Login failed: ${result.error}`);
      }
    } catch (error) {
      setMessage("Error during login");
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
        setCurrentUser(result.user);
        setAuthToken(result.token);
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("auth_user", JSON.stringify(result.user));
        setMessage(`Registration successful! Welcome, ${result.user.name}`);
      } else {
        setMessage(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      setMessage("Error during registration");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading invite information...</div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invite</h1>
          <p className="text-gray-600 mb-6">This invite link is not valid or has expired.</p>
          <Button onClick={() => router.push("/dashboard")} variant="primary">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Group</h1>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-amber-900">{group.name}</h2>
            {group.description && <p className="text-amber-700 text-sm mt-1">{group.description}</p>}
            <p className="text-amber-600 text-xs mt-2">Created {new Date(group.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {message && (
          <Alert variant="info" className="mb-6">
            {message}
          </Alert>
        )}

        {currentUser ? (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              You're logged in as <strong>{currentUser.name}</strong>
            </p>
            <Button onClick={handleJoinGroup} disabled={isJoining} variant="primary" size="lg" className="w-full">
              {isJoining ? "Joining..." : `Join "${group.name}"`}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-center mb-6">Please log in or create an account to join this group</p>
            <AuthContainer onLogin={handleLogin} onRegister={handleRegister} />
          </div>
        )}
      </div>
    </div>
  );
}
