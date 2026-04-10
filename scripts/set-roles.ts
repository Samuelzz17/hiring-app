import { getAdminDb } from '../src/db/firestore';

async function setRoles() {
  const db = getAdminDb();
  
  const adminUid = "kvjHnQKPexYUkW5BqyyliL8J87g2";
  const userUid = "RcIHOQwpizQebGg5tOHpcKtqEDR2";

  console.log("Setting Admin role...");
  await db.collection("users").doc(adminUid).set({
    role: "admin",
    updatedAt: new Date()
  }, { merge: true });

  console.log("Setting Candidate role...");
  await db.collection("users").doc(userUid).set({
    role: "candidate",
    updatedAt: new Date()
  }, { merge: true });

  console.log("Done!");
}

setRoles().catch(console.error);
