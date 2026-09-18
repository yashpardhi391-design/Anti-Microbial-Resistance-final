import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read Firebase config metadata (projectId, authDomain, etc.)
import rawConfig from "../../firebase-applet-config.json";

// Retrieve Google / Firebase API Key securely from environment variable
const googleApiKey =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_API_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_GOOGLE_API_KEY) ||
  rawConfig.apiKey ||
  "";

const firebaseConfig = {
  ...rawConfig,
  apiKey: googleApiKey,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export default app;
