"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Attempt = {
  topic: string;
  score: number;
  total: number;
  date: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userRaw);
    const userKey = `quizAttempts_${user.email}`;

    const data = JSON.parse(
      localStorage.getItem(userKey) || "[]"
    );

    setAttempts(data);
  }, [router]);

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        No quizzes taken yet 📘
      </div>
    );
  }

  const stats = attempts.reduce((acc: any, cur) => {
    if (!acc[cur.topic]) {
      acc[cur.topic] = { score: 0, total: 0 };
    }
    acc[cur.topic].score += cur.score;
    acc[cur.topic].total += cur.total;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
        📊 Learning Dashboard
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(stats).map((topic) => {
          const percentage = Math.round(
            (stats[topic].score / stats[topic].total) * 100
          );

          return (
            <div
              key={topic}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-indigo-600 mb-2">
                {topic}
              </h2>

              <p
                className={`font-semibold ${
                  percentage >= 75
                    ? "text-green-600"
                    : percentage >= 50
                    ? "text-yellow-500"
                    : "text-red-600"
                }`}
              >
                Accuracy: {percentage}%
              </p>

              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className={`h-3 rounded-full ${
                    percentage >= 75
                      ? "bg-green-500"
                      : percentage >= 50
                      ? "bg-yellow-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
