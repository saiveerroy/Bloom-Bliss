
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEIbVnXX-ggXB539AU_O9xhWDlqapyKlc",
  authDomain: "bloom-bliss-c7b65.firebaseapp.com",
  projectId: "bloom-bliss-c7b65",
  storageBucket: "bloom-bliss-c7b65.firebasestorage.app",
  messagingSenderId: "291825039662",
  appId: "1:291825039662:web:fc66e652914aa3b36be2bf",
  measurementId: "G-VP7HXX5RYV"
};

// CUSTOMER APP
const app =
  getApps().find((item) => item.name === "[DEFAULT]") ||
  initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ADMIN APP
const adminApp =
  getApps().find((item) => item.name === "ADMIN") ||
  initializeApp(firebaseConfig, "ADMIN");

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

// STORAGE
export const storage = getStorage(app);

// Separate login sessions
export const customerAuthReady = setPersistence(
  auth,
  browserLocalPersistence
);

export const adminAuthReady = setPersistence(
  adminAuth,
  browserLocalPersistence
);
