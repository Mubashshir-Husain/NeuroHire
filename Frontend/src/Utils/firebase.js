


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "neurohire-6d6ba.firebaseapp.com",
  projectId: "neurohire-6d6ba",
  storageBucket: "neurohire-6d6ba.firebasestorage.app",
  messagingSenderId: "799533936598",
  appId: "1:799533936598:web:0b895199a0a6c53a077e77",
  measurementId: "G-42YTY777N6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };