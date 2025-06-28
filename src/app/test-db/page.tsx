"use client";

import { useState } from "react";

export default function TestDatabase() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

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

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(`Registration successful! Welcome, ${data.user.name}`);
        setFormData({ name: "", email: "", password: "" });
        setCurrentUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      } else {
        setMessage(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error during registration");
    }
  };

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(`Login successful! Welcome back, ${data.user.name}`);
        setLoginData({ email: "", password: "" });
        setCurrentUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      } else {
        setMessage(`Login failed: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error during login");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken("");
    setUsers([]);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setMessage("Logged out successfully");
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Supabase Database Test</h1>

      {/* Current User Status */}
      {currentUser && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>
              Logged in as: <strong>{currentUser.name}</strong> ({currentUser.email})
            </span>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      )}

      {message && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          <form onSubmit={registerUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password (min 6 chars)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Register
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <form onSubmit={loginUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Users List */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
          <button onClick={fetchUsers} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700" disabled={!currentUser}>
            {currentUser ? "Refresh Users" : "Login to View Users"}
          </button>
        </div>

        {users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user: any) => (
              <div key={user.id} className="p-3 bg-gray-50 rounded border">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-400">ID: {user.id}</div>
                <div className="text-xs text-gray-400">Created: {new Date(user.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{currentUser ? "No users found. Register more users or click refresh!" : "Please log in to view users."}</p>
        )}
      </div>
    </div>
  );
}
