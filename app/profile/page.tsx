"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  loginTime: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userRaw));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">
          👤 User Profile
        </h1>

        <div className="mb-4">
          <p className="text-gray-500">Gmail ID</p>
          <p className="text-lg font-semibold text-gray-800">
            {user.email}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-500">Login Time</p>
          <p className="text-gray-700">
            {new Date(user.loginTime).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            🏠 Back to Home
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/login");
            }}
            className="text-red-600 underline font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
