'use client';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// This is the only import we need for Firebase here!
import { auth } from "@/lib/firebase";

export default function LoginButton() {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="mt-4 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
    >
      Sign in with Google
    </button>
  );
};