import fs from 'node:fs/promises';
import path from 'node:path';
import { saveCvToFirebaseStorage } from '@/lib/cv-storage';

type SavedFile = {
  path: string;
  name: string;
  mimeType: string;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_CV_CHARS = 30_000;

function safeFilename(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').slice(0, 80);
  return base || 'cv';
}

async function extractTextFromBytes(input: {
  buffer: Buffer;
  mimeType?: string;
  originalName?: string;
}): Promise<string> {
  const mime = (input.mimeType || '').toLowerCase();
  const ext = path.extname(input.originalName || '').toLowerCase();

  if (mime.includes('pdf') || ext === '.pdf') {
    const pdfParseMod = (await import('pdf-parse')) as unknown as { default?: unknown };
    const pdfParse = (pdfParseMod as any).default ?? (pdfParseMod as any);
    const parsed = await pdfParse(input.buffer);
    return parsed.text ?? '';
  }

  if (mime.includes('word') || ext === '.docx') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer: input.buffer });
    return result.value ?? '';
  }

  if (mime.startsWith('text/') || ext === '.txt' || mime === '') {
    return input.buffer.toString('utf8');
  }

  throw new Error('Unsupported CV file type. Please upload PDF, DOCX, or TXT.');
}

export async function extractCvTextAndSaveUpload(input: {
  file: File | null;
  fallbackText?: string;
}) {
  const uploadsDir = path.join(process.cwd(), 'data', 'uploads');

  let savedFile: SavedFile | undefined;
  let cvText = (input.fallbackText ?? '').trim();

  if (input.file) {
    if (input.file.size > MAX_FILE_BYTES) {
      throw new Error('CV file is too large (max 10MB).');
    }

    const fileBytes = Buffer.from(await input.file.arrayBuffer());
    const originalName = input.file.name || 'cv';
    const mimeType = input.file.type || 'application/octet-stream';

    const stored = await saveCvToFirebaseStorage({
      bytes: fileBytes,
      originalName,
      mimeType,
    });

    if (stored) {
      savedFile = stored;
    } else {
      await fs.mkdir(uploadsDir, { recursive: true });
      const finalName = `${crypto.randomUUID()}_${safeFilename(originalName)}`;
      const finalPath = path.join(uploadsDir, finalName);
      await fs.writeFile(finalPath, fileBytes);

      savedFile = {
        path: finalPath,
        name: originalName,
        mimeType,
      };
    }

    const extracted = await extractTextFromBytes({
      buffer: fileBytes,
      mimeType,
      originalName,
    });
    cvText = extracted.trim();
  }

  if (!cvText) {
    throw new Error('CV is required. Upload a file or paste CV text.');
  }

  if (cvText.length > MAX_CV_CHARS) {
    cvText = cvText.slice(0, MAX_CV_CHARS);
  }

  return { savedFile, cvText };
}
