"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("quizResult");
    if (!data) {
      router.push("/");
      return;
    }
    setResult(JSON.parse(data));
  }, [router]);

  if (!result) return null;

  const percentage = Math.round(
    (result.score / result.total) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">
          🎉 Quiz Result
        </h1>

        <p className="text-gray-600 mb-6">
          Topic: <b>{result.topic}</b>
        </p>

        <div className="text-6xl font-bold text-green-600 mb-4">
          {percentage}%
        </div>

        <p className="text-lg font-bold text-indigo-700 mb-4">
          Score: {result.score} / {result.total}
        </p>

        <div
          className={`text-xl font-semibold mb-6 ${
            percentage >= 70
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {percentage >= 70
            ? "Excellent! 🎯 You’re ready to move forward."
            : "Needs improvement 🔁 Try again."}
        </div>

        <button
          onClick={() => router.push("/")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          🔁 Take Another Quiz
        </button>
      </div>
    </div>
  );
}
