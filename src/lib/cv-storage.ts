import { getAdminStorage } from '@/db/firestore';

export type StoredCvFile = {
  path: string;
  name: string;
  mimeType: string;
};

function safeFilename(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').slice(0, 80);
  return base || 'cv';
}

export async function saveCvToFirebaseStorage(input: {
  bytes: Buffer;
  originalName: string;
  mimeType: string;
}) {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucketName) return null;

  const storage = getAdminStorage();
  const bucket = storage.bucket(bucketName);

  const objectPath = `cvs/${crypto.randomUUID()}_${safeFilename(input.originalName)}`;
  await bucket.file(objectPath).save(input.bytes, {
    contentType: input.mimeType || 'application/octet-stream',
    resumable: false,
    metadata: {
      cacheControl: 'private, max-age=0',
    },
  });

  return {
    path: `gs://${bucket.name}/${objectPath}`,
    name: input.originalName,
    mimeType: input.mimeType || 'application/octet-stream',
  } satisfies StoredCvFile;
}

