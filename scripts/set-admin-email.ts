import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import 'dotenv/config';

async function setAdminByEmail() {
  // Initialize app if not already initialized
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } else {
       initializeApp();
    }
  }

  const email = 'mzazu6@gmail.com';
  const auth = getAuth();
  const db = getFirestore();

  try {
    // Look up user by email
    const userRecord = await auth.getUserByEmail(email);
    console.log(`Found user with UID: ${userRecord.uid}`);

    // Update or create document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      role: 'admin',
      displayName: userRecord.displayName || 'Owner',
      createdAt: new Date().toISOString()
    }, { merge: true });

    console.log(`Successfully elevated ${email} to admin!`);
  } catch (error) {
    console.error(`Error finding or updating user:`, error);
  }
}

setAdminByEmail();
