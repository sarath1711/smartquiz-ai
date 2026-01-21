"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizPage() {
  const router = useRouter();

  const [topic, setTopic] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // ✅ Get topic safely (client-only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("topic");
    if (!t) {
      router.push("/");
      return;
    }
    setTopic(t);
  }, [router]);

  // ✅ Fetch quiz
  useEffect(() => {
    if (!topic) return;

    async function fetchQuiz() {
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        });

        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [topic]);

  // ✅ Handle option select
  function selectAnswer(qIndex: number, option: string) {
    setAnswers({ ...answers, [qIndex]: option });
  }

  // ✅ Submit quiz
  function submitQuiz() {
    let correct = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });

    setScore(correct);
    setSubmitted(true);

    // 🔐 Save attempt (localStorage)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");

    history.push({
      email: user.email || "guest",
      topic,
      score: correct,
      total: questions.length,
      date: new Date().toISOString(),
    });

    localStorage.setItem("quizHistory", JSON.stringify(history));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          🧠 {topic} Quiz
        </h1>

        {!submitted ? (
          <>
            {questions.map((q, i) => (
              <div
                key={i}
                className="mb-6 p-5 rounded-2xl bg-indigo-50 border border-indigo-200"
              >
                <p className="font-semibold mb-3 text-gray-800">
                  {i + 1}. {q.question}
                </p>

                {q.options.map((opt) => (
                  <label
                 key={opt}
                className={`block p-3 rounded-xl cursor-pointer mb-3 border transition
                ${
                 answers[i] === opt
                 ? "bg-indigo-600 text-white border-indigo-700"
                : "bg-white text-gray-800 border-gray-300 hover:bg-indigo-100 hover:border-indigo-400"
    }`}
>

                    <input
                      type="radio"
                      name={`q${i}`}
                      className="hidden"
                      onChange={() => selectAnswer(i, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            <button
              onClick={submitQuiz}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg transition"
            >
              ✅ Submit Quiz
            </button>
          </>
        ) : (
          // 🎉 RESULT VIEW
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-purple-700">
              🎉 Quiz Completed!
            </h2>

            <p className="text-xl mb-4">
              Score:
              <span className="font-bold text-green-600 ml-2">
                {score} / {questions.length}
              </span>
            </p>

            <p
              className={`text-lg font-semibold mb-6 ${
                score / questions.length >= 0.5
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Accuracy: {Math.round((score / questions.length) * 100)}%
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                📊 Dashboard
              </button>

              <button
                onClick={() => router.push("/")}
                className="bg-gray-300 px-6 py-3 rounded-xl font-bold"
              >
                🏠 Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
