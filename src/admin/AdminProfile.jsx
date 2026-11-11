
import React from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { adminAuth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
  await signOut(adminAuth);
  navigate("/admin-login", { replace: true });
};

  return (
    <div className="min-h-screen bg-[#fffaf7] p-6 sm:p-10">

      <div className="mx-auto max-w-2xl">

        <h1 className="mb-2 text-3xl font-bold text-[#382b2b]">
          Administrator Profile 🌸
        </h1>

        <p className="mb-8 text-gray-500">
          Your Bloom & Bliss account details.
        </p>

        <div className="rounded-2xl border border-pink-100 bg-white p-8 shadow-sm">

          <div className="mb-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-5xl">
              👩
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Shop Owner
            </h2>

            <p className="text-sm text-green-600">
              Administrator
            </p>
          </div>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Email Address
              </p>
              <p className="font-semibold">
                {user?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Administrator UID
              </p>
              <p className="break-all text-sm font-medium">
                {user?.uid}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Status
              </p>
              <p className="font-semibold text-green-600">
                Signed In
              </p>
            </div>

          </div>

          <button
            onClick={() => navigate("/admin")}
            className="mt-8 w-full rounded-xl bg-[#536b50] py-3 text-white"
          >
            Back to Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-xl bg-red-600 py-3 text-white"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
