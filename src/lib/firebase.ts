import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// THIS IS WHERE YOUR REAL KEYS WILL GO
const firebaseConfig = {
  apiKey: "AIzaSyDXhpqBDihbU6Fe444_5S1DkzaENmbmQgc",
  authDomain: "options-forge.firebaseapp.com",
  projectId: "options-forge",
  storageBucket: "options-forge.firebasestorage.app",
  messagingSenderId: "932106715919",
  appId: "1:932106715919:web:0152c670badcad2ecbb47a",
  measurementId: "G-XDYRPQSNY2"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);