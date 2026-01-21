"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Leader = {
  email: string;
  accuracy: number;
  totalAttempts: number;
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    // 🔐 Login protection
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }

    const leaderboard: Leader[] = [];

    // 📊 Collect all users' quiz data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("quizAttempts_")) continue;

      const email = key.replace("quizAttempts_", "");
      const attempts = JSON.parse(
        localStorage.getItem(key) || "[]"
      );

      if (attempts.length === 0) continue;

      let score = 0;
      let total = 0;

      attempts.forEach((a: any) => {
        score += a.score;
        total += a.total;
      });

      const accuracy = Math.round((score / total) * 100);

      leaderboard.push({
        email,
        accuracy,
        totalAttempts: attempts.length,
      });
    }

    // 🏆 Sort by accuracy
    leaderboard.sort((a, b) => b.accuracy - a.accuracy);
    setLeaders(leaderboard);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        
        {/* ---------- TITLE ---------- */}
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
          🏆 Leaderboard
        </h1>

        {/* ---------- TABLE ---------- */}
        {leaders.length === 0 ? (
          <p className="text-center text-gray-600">
            No leaderboard data available yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden">
              
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="p-4 text-left">Rank</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-center">Accuracy</th>
                  <th className="p-4 text-center">Attempts</th>
                </tr>
              </thead>

              <tbody>
                {leaders.map((leader, index) => {
                  const rowBg =
                    index === 0
                      ? "bg-yellow-100"
                      : index === 1
                      ? "bg-gray-100"
                      : index === 2
                      ? "bg-orange-100"
                      : "bg-white";

                  return (
                    <tr
                      key={leader.email}
                      className={`${rowBg} border-b hover:bg-indigo-50 transition`}
                    >
                      {/* Rank */}
                      <td className="p-4 font-bold text-lg">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && index + 1}
                      </td>

                      {/* User */}
                      <td className="p-4 font-semibold text-gray-800">
                        {leader.email}
                      </td>

                      {/* Accuracy */}
                      <td
                        className={`p-4 text-center font-bold ${
                          leader.accuracy >= 75
                            ? "text-green-600"
                            : leader.accuracy >= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {leader.accuracy}%
                      </td>

                      {/* Attempts */}
                      <td className="p-4 text-center font-semibold text-gray-700">
                        {leader.totalAttempts}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- FOOTER ---------- */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
