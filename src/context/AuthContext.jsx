import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          try {
            const customerRef = doc(
              db,
              "customers",
              firebaseUser.uid
            );

            const customerSnap = await getDoc(customerRef);

            setCustomer(
              customerSnap.exists()
                ? customerSnap.data()
                : {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || "",
                    email: firebaseUser.email,
                  }
            );
          } catch (error) {
            console.error("Profile loading error:", error);

            setCustomer({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "",
              email: firebaseUser.email,
            });
          }
        } else {
          setCustomer(null);
        }

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // CUSTOMER REGISTRATION
  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    await updateProfile(credential.user, {
      displayName: name.trim(),
    });

    const customerData = {
      uid: credential.user.uid,
      name: name.trim(),
      email: email.trim(),
      createdAt: serverTimestamp(),
    };

    await setDoc(
      doc(db, "customers", credential.user.uid),
      customerData
    );

    setCustomer({
      ...customerData,
      createdAt: null,
    });

    return credential.user;
  };

  // CUSTOMER LOGIN
  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    return credential.user;
  };

  // CUSTOMER LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // FORGOT PASSWORD
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const value = {
    user,
    customer,
    loading,
    register,
    login,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}