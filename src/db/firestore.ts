import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function cleanEnv(val: string | undefined): string | undefined {
  if (!val) return val;
  return val.replace(/^["'](.*)["']$/, '$1');
}

function initAdmin() {
  if (getApps().length) return;

  const projectId = cleanEnv(process.env.FIREBASE_PROJECT_ID);
  const clientEmail = cleanEnv(process.env.FIREBASE_CLIENT_EMAIL);
  
  // Handle newlines in private key and strip potential surrounding quotes
  let privateKeyRaw = cleanEnv(process.env.FIREBASE_PRIVATE_KEY);
  const privateKey = privateKeyRaw ? privateKeyRaw.replace(/\\n/g, '\n') : undefined;

  try {
    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        storageBucket: cleanEnv(process.env.FIREBASE_STORAGE_BUCKET),
      });
      console.log("Firebase Admin Initialized with cert.");
      return;
    }

    // Fallback for environments with ADC
    initializeApp({
      projectId: projectId || "hiring-app-4679d",
      storageBucket: cleanEnv(process.env.FIREBASE_STORAGE_BUCKET) || "hiring-app-4679d.firebasestorage.app",
    });
    console.log("Firebase Admin Initialized with ADC fallback.");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

export function getAdminDb() {
  initAdmin();
  return getFirestore();
}

export function getAdminStorage() {
  initAdmin();
  return getStorage();
}
