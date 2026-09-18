import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read Firebase config metadata (projectId, authDomain, etc.)
import rawConfig from "../../firebase-applet-config.json";

// Retrieve Google / Firebase API Key securely from environment variables with built-in sandbox default
const googleApiKey =
  (typeof process !== "undefined" && process.env?.VITE_GOOGLE_API_KEY) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_API_KEY) ||
  rawConfig.apiKey ||
  "AIzaSyAxHjP54NxU8Or5e0kzP2fuews8Z4RZk24";

const firebaseConfig = {
  ...rawConfig,
  apiKey: googleApiKey,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export default app;
