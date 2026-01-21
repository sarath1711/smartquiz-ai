"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // ✅ Save login locally
    localStorage.setItem(
      "user",
      JSON.stringify({
        email,
        loginTime: new Date().toISOString(),
      })
    );

    // 🚀 Force redirect (cannot be blocked)
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🔐 Login
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border-2 border-indigo-400 rounded-xl mb-4
                     text-gray-800 placeholder-gray-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border-2 border-indigo-400 rounded-xl mb-6
                     text-gray-800 placeholder-gray-400"
        />

        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
