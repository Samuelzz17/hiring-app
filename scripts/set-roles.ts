import { getAdminDb } from '../src/db/firestore';

async function setRoles() {
  const db = getAdminDb();
  
  // Set Admin Account
  const adminUid = 'kvjHnQKPexYUkW5BqyyliL8J87g2';
  await db.collection('users').doc(adminUid).set({
    uid: adminUid,
    role: 'admin',
    displayName: 'Admin User',
    email: 'admin@jobflow.com', // Placeholder email, you can update this
    createdAt: new Date().toISOString()
  }, { merge: true });
  console.log('Set admin role for:', adminUid);

  // Set User Account
  const userUid = 'RcIHOQwpizQebGg5tOHpcKtqEDR2';
  await db.collection('users').doc(userUid).set({
    uid: userUid,
    role: 'candidate',
    displayName: 'Candidate User',
    email: 'candidate@jobflow.com',
    createdAt: new Date().toISOString()
  }, { merge: true });
  console.log('Set candidate role for:', userUid);
  
  return { success: true };
}

setRoles().catch(console.error);
