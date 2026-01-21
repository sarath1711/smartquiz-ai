"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const topics = ["Python Basics", "Arrays", "Loops", "Functions"];
  useEffect(() => {
  const user = localStorage.getItem("user");
  if (!user && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}, []);

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center p-6">
      <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-3xl p-10">
        
        {/* ---------- HEADER ---------- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 flex justify-center items-center gap-2">
            🎯 SmartQuiz AI
          </h1>
          <p className="text-gray-600 mt-2">
            Personalized AI-powered learning platform
          </p>
        </div>

        {/* ---------- QUIZ SECTION ---------- */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Select a Topic
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => router.push(`/quiz?topic=${topic}`)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500
                           text-white py-4 rounded-2xl font-semibold
                           shadow hover:scale-105 transition"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- ACTION LINKS ---------- */}
        <div className="border-t pt-6 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm font-semibold">
          
          <button
            onClick={() => router.push("/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            👤 Profile
          </button>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            🚪 Logout
          </button>
          <button
              onClick={() => router.push("/leaderboard")}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              🏆 Leaderboard
          </button>
          <button
              onClick={() => router.push("/subject-leaderboard")}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              📊 Subject Leaderboard
            </button>

        </div>

      </div>
    </main>
  );
}
