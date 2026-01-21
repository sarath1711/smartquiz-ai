"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Leader = {
  email: string;
  accuracy: number;
  attempts: number;
};

const TOPICS = ["Python Basics", "Arrays", "Loops", "Functions"];

export default function SubjectLeaderboardPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0]);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  // 🔐 Login protection
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  // 🔁 Recalculate leaderboard when topic changes
  useEffect(() => {
    const leaderboard: Leader[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("quizAttempts_")) continue;

      const email = key.replace("quizAttempts_", "");
      const attempts = JSON.parse(
        localStorage.getItem(key) || "[]"
      );

      // Filter attempts by selected subject
      const subjectAttempts = attempts.filter(
        (a: any) => a.topic === selectedTopic
      );

      if (subjectAttempts.length === 0) continue;

      let score = 0;
      let total = 0;

      subjectAttempts.forEach((a: any) => {
        score += a.score;
        total += a.total;
      });

      const accuracy = Math.round((score / total) * 100);

      leaderboard.push({
        email,
        accuracy,
        attempts: subjectAttempts.length,
      });
    }

    leaderboard.sort((a, b) => b.accuracy - a.accuracy);
    setLeaders(leaderboard);
  }, [selectedTopic]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">

        {/* ---------- HEADER ---------- */}
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
          📊 Subject-wise Leaderboard
        </h1>

        {/* ---------- SUBJECT SELECT ---------- */}
        <div className="flex justify-center mb-8">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-6 py-3 rounded-xl border-2 border-indigo-400
                       font-semibold text-indigo-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- TABLE ---------- */}
        {leaders.length === 0 ? (
          <p className="text-center text-gray-600">
            No attempts yet for <b>{selectedTopic}</b>
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
                      <td className="p-4 font-bold">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && index + 1}
                      </td>

                      <td className="p-4 font-semibold text-gray-800">
                        {leader.email}
                      </td>

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

                      <td className="p-4 text-center font-semibold">
                        {leader.attempts}
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
            className="text-indigo-600 underline font-semibold"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
