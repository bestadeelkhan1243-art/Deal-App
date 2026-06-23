import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAphpYNHNemEC-gKefc2YhSu_AxBaPd7sA",
  authDomain: "dealapp-dfbb3.firebaseapp.com",
  projectId: "dealapp-dfbb3",
  storageBucket: "dealapp-dfbb3.firebasestorage.app",
  messagingSenderId: "845567250283",
  appId: "1:845567250283:web:181a63e102d482ea42862e"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };
