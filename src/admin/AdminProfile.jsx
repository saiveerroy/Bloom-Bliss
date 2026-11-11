
import React, { useEffect, useState } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { adminAuth } from "../firebase";

import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      adminAuth,
      (user) => {
        setAdmin(user);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      navigate("/admin-login", { replace: true });
    } catch (error) {
      console.error("Admin logout error:", error);
      alert("Unable to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading administrator profile...
      </div>
    );
  }

  if (!admin) {
    return null;
  }

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
                {admin.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Administrator UID
              </p>
              <p className="break-all text-sm font-medium">
                {admin.uid}
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
