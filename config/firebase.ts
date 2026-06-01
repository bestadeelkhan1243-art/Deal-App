import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence, 
  getAuth,
  Auth
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';

// Replace with your client's live Firebase project credentials when ready
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "placeholder-look-deal.firebaseapp.com",
  projectId: "placeholder-look-deal",
  storageBucket: "placeholder-look-deal.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

let app;
let auth: Auth;
let db: Firestore;
let isFirebaseInitialized = false;

// Check if credentials are still placeholder templates
const isPlaceholder = firebaseConfig.apiKey === "PLACEHOLDER_API_KEY";

if (!isPlaceholder) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Wire up AsyncStorage persistence for persistent React Native sessions
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    
    db = getFirestore(app);
    isFirebaseInitialized = true;
    console.log("🔥 Look Deal Firebase Backend successfully initialized.");
  } catch (error) {
    console.warn("⚠️ Firebase Initialization Error. Falling back to Demo Mode:", error);
  }
} else {
  console.log("✨ Demo Mode Active: Firebase configuration placeholders found. Local state will be used.");
}

// Fallback exports to prevent bundle crashes if Firebase is unconfigured
export { app, auth, db, isFirebaseInitialized };
