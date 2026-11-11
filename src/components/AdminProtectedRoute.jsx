
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { adminAuth, adminDb } from "../firebase";

export default function AdminProtectedRoute({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(
      adminAuth,
      async (firebaseUser) => {
        if (!active) return;

        setLoading(true);
        setError("");

        if (!firebaseUser) {
          setAdmin(null);
          setLoading(false);
          return;
        }

        try {
          const adminRef = doc(
            adminDb,
            "admins",
            firebaseUser.uid
          );

          const adminSnap = await getDoc(adminRef);

          if (
            adminSnap.exists() &&
            adminSnap.data().role === "admin"
          ) {
            if (active) setAdmin(firebaseUser);
          } else {
            if (active) setAdmin(null);
          }
        } catch (err) {
          console.error("Admin verification error:", err);

          if (active) {
            setError(err.message);
            setAdmin(null);
          }
        } finally {
          if (active) setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking administrator access...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        Admin verification failed: {error}
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
