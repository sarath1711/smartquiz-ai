"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: string; // "A", "B", "C", "D"
};

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Login protection
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");
  }, [router]);

  // 📥 Fetch quiz from API
  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        });

        const data = await res.json();

        if (!data.questions || data.questions.length === 0) {
          setError("No questions available.");
          return;
        }

        setQuestions(data.questions);
        setUserAnswers(new Array(data.questions.length).fill(""));
      } catch {
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    }

    if (topic) loadQuiz();
  }, [topic]);

  // ✅ Store selected option as A/B/C/D
  function handleSelect(questionIndex: number, optionIndex: number) {
    const updated = [...userAnswers];
    updated[questionIndex] = String.fromCharCode(65 + optionIndex); // A, B, C, D
    setUserAnswers(updated);
  }

  // 🧮 Submit quiz and evaluate correctly
  function handleSubmit() {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userRaw);
    const userKey = `quizAttempts_${user.email}`;

    let score = 0;
    questions.forEach((q, i) => {
      if (q.answer === userAnswers[i]) {
        score++;
      }
    });

    const attempt = {
      topic,
      score,
      total: questions.length,
      date: new Date().toISOString(),
    };

    const previousAttempts = JSON.parse(
      localStorage.getItem(userKey) || "[]"
    );

    previousAttempts.push(attempt);

    localStorage.setItem(
      userKey,
      JSON.stringify(previousAttempts)
    );

    sessionStorage.setItem(
      "quizResult",
      JSON.stringify({
        topic,
        score,
        total: questions.length,
      })
    );

    router.push("/result");
  }

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-600 text-white text-xl">
        ⏳ Loading quiz...
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  // 🧠 Quiz UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        🧠 {topic} Quiz
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {questions.map((q, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <p className="text-lg font-bold text-indigo-700 mb-4 bg-indigo-50 p-3 rounded-xl">
              {i + 1}. {q.question}
            </p>

            {q.options.map((opt, optIndex) => {
              const optionLetter = String.fromCharCode(65 + optIndex);

              return (
                <label
                  key={optIndex}
                  className="flex items-center gap-3 p-4 border rounded-xl mb-2 cursor-pointer hover:bg-indigo-50"
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={userAnswers[i] === optionLetter}
                    onChange={() => handleSelect(i, optIndex)}
                    className="accent-indigo-600"
                  />

                  <span className="font-bold text-indigo-600">
                    {optionLetter}.
                  </span>

                  <span className="text-gray-800">
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition"
        >
          🚀 Submit Quiz
        </button>
      </div>
    </div>
  );
}
