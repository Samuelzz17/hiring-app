import { getAdminDb } from '@/db/firestore';

export type JobStatus = 'DRAFT' | 'OPEN' | 'CLOSED';
export type ApplicationStage =
  | 'APPLIED'
  | 'SCREENED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED';

export type JobRow = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string;
  requirements: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};

export type BoardCandidateRow = {
  applicationId: string;
  stage: ApplicationStage;
  fitScore: number;
  fitExplanation: string | null;
  createdAt: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string | null;
  candidateLinkedIn: string | null;
  jobId: string;
  jobTitle: string;
};

export type EmployeeRow = {
  id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  startDate: string | null;
  createdAt: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
};

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

type JobDoc = Omit<JobRow, 'id'>;
type CandidateDoc = {
  name: string;
  email: string;
  phone: string | null;
  linkedIn: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApplicationDoc = {
  jobId: string;
  candidateId: string;
  stage: ApplicationStage;
  fitScore: number;
  fitExplanation: string | null;
  cvFilePath: string | null;
  cvFileName: string | null;
  cvMimeType: string | null;
  cvText: string | null;
  extractedJson: unknown | null;
  createdAt: string;
  updatedAt: string;
};

type EmployeeDoc = {
  applicationId: string;
  candidateId: string;
  jobId: string;
  startDate: string | null;
  createdAt: string;
};

function collections() {
  const db = getAdminDb();
  return {
    jobs: db.collection('jobs'),
    candidates: db.collection('candidates'),
    applications: db.collection('applications'),
    employees: db.collection('employees'),
  };
}

export async function createJob(input: {
  title: string;
  department?: string;
  location?: string;
  description: string;
  requirements?: string;
  status?: JobStatus;
}) {
  const id = newId();
  const ts = nowIso();
  const status: JobStatus = input.status ?? 'OPEN';

  const { jobs } = collections();
  const doc: JobDoc = {
    title: input.title,
    department: input.department ?? null,
    location: input.location ?? null,
    description: input.description,
    requirements: input.requirements ?? null,
    status,
    createdAt: ts,
    updatedAt: ts,
  };
  await jobs.doc(id).set(doc);
  return id;
}

export async function listJobs(): Promise<JobRow[]> {
  const { jobs } = collections();
  const snap = await jobs.orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as JobDoc) }));
}

export async function listOpenJobs(): Promise<JobRow[]> {
  const { jobs } = collections();
  const snap = await jobs.where('status', '==', 'OPEN').orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as JobDoc) }));
}

export async function getJob(jobId: string): Promise<JobRow | null> {
  const { jobs } = collections();
  const doc = await jobs.doc(jobId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as JobDoc) };
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const { jobs } = collections();
  await jobs.doc(jobId).set({ status, updatedAt: nowIso() }, { merge: true });
}

export async function createApplication(input: {
  jobId: string;
  candidate: { name: string; email: string; phone?: string; linkedIn?: string };
  cv: {
    filePath?: string;
    fileName?: string;
    mimeType?: string;
    text?: string;
    extractedJson?: unknown;
  };
  scoring: { fitScore: number; fitExplanation?: string };
}) {
  const ts = nowIso();

  const candidateId = newId();
  const { candidates, applications } = collections();
  const candidateDoc: CandidateDoc = {
    name: input.candidate.name,
    email: input.candidate.email,
    phone: input.candidate.phone ?? null,
    linkedIn: input.candidate.linkedIn ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  await candidates.doc(candidateId).set(candidateDoc);

  const applicationId = newId();
  const applicationDoc: ApplicationDoc = {
    jobId: input.jobId,
    candidateId,
    stage: 'APPLIED',
    fitScore: Math.max(0, Math.min(100, Math.round(input.scoring.fitScore))),
    fitExplanation: input.scoring.fitExplanation ?? null,
    cvFilePath: input.cv.filePath ?? null,
    cvFileName: input.cv.fileName ?? null,
    cvMimeType: input.cv.mimeType ?? null,
    cvText: input.cv.text ?? null,
    extractedJson: input.cv.extractedJson ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  await applications.doc(applicationId).set(applicationDoc);

  return { applicationId, candidateId };
}

export async function listBoardCandidates(filter?: { jobId?: string }): Promise<BoardCandidateRow[]> {
  const { applications, candidates, jobs } = collections();

  let q = applications.orderBy('createdAt', 'desc') as FirebaseFirestore.Query;
  if (filter?.jobId) q = q.where('jobId', '==', filter.jobId);

  const appsSnap = await q.get();
  const apps = appsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as ApplicationDoc) }));

  const candidateIds = [...new Set(apps.map((a) => a.candidateId))];
  const jobIds = [...new Set(apps.map((a) => a.jobId))];

  const candidateDocs = await Promise.all(candidateIds.map((id) => candidates.doc(id).get()));
  const jobDocs = await Promise.all(jobIds.map((id) => jobs.doc(id).get()));

  const candidateMap = new Map(
    candidateDocs
      .filter((d) => d.exists)
      .map((d) => [d.id, d.data() as CandidateDoc] as const)
  );
  const jobMap = new Map(
    jobDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as JobDoc] as const)
  );

  return apps
    .map((a) => {
      const c = candidateMap.get(a.candidateId);
      const j = jobMap.get(a.jobId);
      if (!c || !j) return null;
      return {
        applicationId: a.id,
        stage: a.stage,
        fitScore: a.fitScore,
        fitExplanation: a.fitExplanation,
        createdAt: a.createdAt,
        candidateId: a.candidateId,
        candidateName: c.name,
        candidateEmail: c.email,
        candidatePhone: c.phone,
        candidateLinkedIn: c.linkedIn,
        jobId: a.jobId,
        jobTitle: j.title,
      } satisfies BoardCandidateRow;
    })
    .filter(Boolean) as BoardCandidateRow[];
}

export async function updateApplicationStage(input: { applicationId: string; stage: ApplicationStage }) {
  const { applications, employees } = collections();
  const ts = nowIso();
  await applications.doc(input.applicationId).set({ stage: input.stage, updatedAt: ts }, { merge: true });

  if (input.stage !== 'HIRED') return;

  const appDoc = await applications.doc(input.applicationId).get();
  if (!appDoc.exists) return;
  const app = appDoc.data() as ApplicationDoc;

  const employeeId = input.applicationId; // idempotent
  const employeeDoc: EmployeeDoc = {
    applicationId: input.applicationId,
    candidateId: app.candidateId,
    jobId: app.jobId,
    startDate: null,
    createdAt: ts,
  };
  await employees.doc(employeeId).set(employeeDoc, { merge: true });
}

export async function listEmployees(): Promise<EmployeeRow[]> {
  const { employees, candidates, jobs } = collections();
  const snap = await employees.orderBy('createdAt', 'desc').get();
  const emps = snap.docs.map((d) => ({ id: d.id, ...(d.data() as EmployeeDoc) }));

  const candidateIds = [...new Set(emps.map((e) => e.candidateId))];
  const jobIds = [...new Set(emps.map((e) => e.jobId))];

  const candidateDocs = await Promise.all(candidateIds.map((id) => candidates.doc(id).get()));
  const jobDocs = await Promise.all(jobIds.map((id) => jobs.doc(id).get()));

  const candidateMap = new Map(
    candidateDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as CandidateDoc] as const)
  );
  const jobMap = new Map(jobDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as JobDoc] as const));

  return emps
    .map((e) => {
      const c = candidateMap.get(e.candidateId);
      const j = jobMap.get(e.jobId);
      if (!c || !j) return null;
      return {
        id: e.id,
        applicationId: e.applicationId,
        candidateId: e.candidateId,
        jobId: e.jobId,
        startDate: e.startDate,
        createdAt: e.createdAt,
        candidateName: c.name,
        candidateEmail: c.email,
        jobTitle: j.title,
      } satisfies EmployeeRow;
    })
    .filter(Boolean) as EmployeeRow[];
}

export async function setEmployeeStartDate(input: { employeeId: string; startDate: string | null }) {
  const { employees } = collections();
  await employees.doc(input.employeeId).set({ startDate: input.startDate }, { merge: true });
}
