import "dotenv/config";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

function cleanEnv(val: string | undefined): string | undefined {
  if (!val || val === "undefined" || val === "null") return undefined;
  return val.replace(/^["'](.*)["']$/, '$1');
}

const firebaseConfig = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || "AIzaSyDAmif7Ey6Y7E_uFJH3i5DAAZOYpoHcVFU",
  authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) || "hiring-app-4679d.firebaseapp.com",
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || "hiring-app-4679d",
  storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || "hiring-app-4679d.firebasestorage.app",
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || "706162478968",
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) || "1:706162478968:web:161becd68690c36253028d",
  measurementId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) || "G-8JLMDWN0T2"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

const isConfigValid = !!firebaseConfig.apiKey;

if (isConfigValid) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Initialize Analytics conditionally (safeguard for SSR and build time)
let analytics: Analytics | undefined;
if (typeof window !== "undefined" && app) {
  isSupported().then((supported) => {
    if (supported && app) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
