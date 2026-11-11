
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (loading) return;

      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        console.log("Signed-in UID:", user.uid);
        console.log("Firebase auth UID:", auth.currentUser?.uid);

        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        console.log("Admin document exists:", adminSnap.exists());

        if (adminSnap.exists()) {
          console.log("Admin document data:", adminSnap.data());
        }

        if (active) {
          setIsAdmin(
            adminSnap.exists() &&
            adminSnap.data().role === "admin"
          );
        }

      } catch (err) {
        console.error("Admin verification error:", err);

        if (active) {
          setError(err.message);
          setIsAdmin(false);
        }

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
    return <div className="p-10 text-center">Checking admin access...</div>;
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        Admin verification failed: {error}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Admin access denied</h2>
        <p>Your Firebase account does not have admin permission.</p>
        <p>Signed-in UID: {user.uid}</p>
      </div>
    );
  }

  return children;
}
