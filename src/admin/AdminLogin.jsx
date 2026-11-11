
import React, { useState } from "react";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { adminAuth, adminDb } from "../firebase";

import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
async function handleLogin(e) {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const credential = await signInWithEmailAndPassword(
      adminAuth,
      email.trim(),
      password
    );

    const adminRef = doc(
      adminDb,
      "admins",
      credential.user.uid
    );

    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists() ||
        adminSnap.data().role !== "admin") {

      await signOut(adminAuth);

      setError("You are not authorized as an administrator.");
      return;
    }

    navigate("/admin", { replace: true });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error.code, error.message);

    if (error.code === "permission-denied") {
      setError("Firestore permission denied. Check your admin security rules.");
    } else if (
      error.code === "auth/invalid-credential"
    ) {
      setError("Incorrect admin email or password.");
    } else {
      setError(error.message || "Admin login failed.");
    }

  } finally {
    setLoading(false);
  }
}


  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-4">

      <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-8 shadow-xl">

        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🌸</div>

          <h1 className="text-3xl font-bold text-[#382b2b]">
            Bloom & Bliss
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Administrator Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-pink-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-pink-400"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#382b2b] py-3 font-semibold text-white transition hover:bg-[#574141] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login as Admin"}
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Bloom & Bliss Admin Portal 🌷
        </p>

      </div>
    </div>
  );
}
