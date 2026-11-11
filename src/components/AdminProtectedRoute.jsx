
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (loading) return;

      if (!user) {
        if (active) setCheckingAdmin(false);
        return;
      }

      try {
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (active) {
          setIsAdmin(
            adminSnap.exists() &&
            adminSnap.data().role === "admin"
          );
        }
      } catch (error) {
        console.error("Admin verification failed:", error);

        if (active) setIsAdmin(false);
      } finally {
        if (active) setCheckingAdmin(false);
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [user, loading]);

  if (loading || checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Verifying administrator access...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
