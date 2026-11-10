import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEIbVnXX-ggXB539AU_O9xhWDlqapyKlc",
  authDomain: "bloom-bliss-c7b65.firebaseapp.com",
  projectId: "bloom-bliss-c7b65",
  storageBucket: "bloom-bliss-c7b65.firebasestorage.app",
  messagingSenderId: "291825039662",
  appId: "1:291825039662:web:fc66e652914aa3b36be2bf",
  measurementId: "G-VP7HXX5RYV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);