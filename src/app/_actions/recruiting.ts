'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  createApplication,
  createJob,
  getJob,
  setEmployeeStartDate,
  updateApplicationStage,
  updateJobStatus,
  type ApplicationStage,
  type JobStatus,
} from '@/db/recruiting';
import { extractCvTextAndSaveUpload } from '@/lib/cv-upload';
import { scoreApplicationFromCv } from '@/lib/scoring';

const createJobSchema = z.object({
  title: z.string().min(3),
  department: z.string().optional(),
  location: z.string().optional(),
  description: z.string().min(50),
  requirements: z.string().optional(),
  status: z.enum(['DRAFT', 'OPEN', 'CLOSED']).optional(),
});

export async function createJobAction(formData: FormData) {
  const parsed = createJobSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await createJob(parsed.data);
  revalidatePath('/dashboard/jobs');
  revalidatePath('/jobs');
}

const jobStatusSchema = z.object({
  jobId: z.string().min(1),
  status: z.enum(['DRAFT', 'OPEN', 'CLOSED']),
});

export async function updateJobStatusAction(formData: FormData) {
  const parsed = jobStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateJobStatus(parsed.data.jobId, parsed.data.status as JobStatus);
  revalidatePath('/dashboard/jobs');
  revalidatePath('/jobs');
  revalidatePath(`/jobs/${parsed.data.jobId}`);
}

const applySchema = z.object({
  jobId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedIn: z.string().url().optional().or(z.literal('')),
  cvText: z.string().optional(),
});

export async function applyToJobAction(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = applySchema.safeParse(raw);
  if (!parsed.success) return;

  const job = await getJob(parsed.data.jobId);
  if (!job) return;
  if (job.status !== 'OPEN') return;

  const upload = formData.get('cvFile');
  const { savedFile, cvText } = await extractCvTextAndSaveUpload({
    file: upload instanceof File ? upload : null,
    fallbackText: parsed.data.cvText,
  });

  const scoring = await scoreApplicationFromCv({
    jobDescription: `${job.title}\n\n${job.description}\n\n${job.requirements ?? ''}`.trim(),
    cvText,
    candidate: { name: parsed.data.name, email: parsed.data.email },
  });

  await createApplication({
    jobId: job.id,
    candidate: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      linkedIn: parsed.data.linkedIn || undefined,
    },
    cv: {
      filePath: savedFile?.path,
      fileName: savedFile?.name,
      mimeType: savedFile?.mimeType,
      text: cvText,
      extractedJson: scoring.extractedJson,
    },
    scoring: { fitScore: scoring.fitScore, fitExplanation: scoring.fitExplanation },
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs');
  revalidatePath(`/jobs/${job.id}`);
  redirect(`/jobs/${job.id}?applied=1`);
}

const stageSchema = z.object({
  applicationId: z.string().min(1),
  stage: z.enum(['APPLIED', 'SCREENED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED']),
});

export async function updateApplicationStageAction(formData: FormData) {
  const parsed = stageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateApplicationStage({
    applicationId: parsed.data.applicationId,
    stage: parsed.data.stage as ApplicationStage,
  });
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/employees');
}

const startDateSchema = z.object({
  employeeId: z.string().min(1),
  startDate: z.string().optional(),
});

export async function setEmployeeStartDateAction(formData: FormData) {
  const parsed = startDateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const startDate = parsed.data.startDate?.trim() ? parsed.data.startDate.trim() : null;
  await setEmployeeStartDate({ employeeId: parsed.data.employeeId, startDate });
  revalidatePath('/dashboard/employees');
}
