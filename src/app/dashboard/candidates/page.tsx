export const dynamic = "force-dynamic";

import CandidateBoard from '@/components/jobflow/candidate-board';
import { listBoardCandidates, listJobs } from '@/db/recruiting';
import type { Candidate } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SeedButton } from '@/components/dashboard/seed-button';

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams?: { jobId?: string };
}) {
  const jobs = await listJobs();
  const jobId = (await searchParams)?.jobId?.trim() || undefined;
  const rows = await listBoardCandidates(jobId ? { jobId } : undefined);

  const candidates: Candidate[] = rows.map((r) => ({
    id: r.applicationId,
    applicationId: r.applicationId,
    candidateId: r.candidateId,
    jobId: r.jobId,
    jobTitle: r.jobTitle,
    name: r.candidateName,
    email: r.candidateEmail,
    stage: r.stage,
    score: r.fitScore,
    avatarUrl: `https://picsum.photos/seed/${r.candidateId}/40/40`,
    rankingExplanation: r.fitExplanation ?? undefined,
  }));

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl font-bold">Candidate Board</h1>
          <p className="text-muted-foreground">Pindahkan stage, dan otomatis buat employee saat stage = Hired.</p>
        </div>

        <div className="flex items-center gap-2">
          <form method="GET" className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Filter job</label>
            <select
              name="jobId"
              defaultValue={jobId ?? ''}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">
              Apply
            </Button>
          </form>
            <Button asChild size="sm">
              <Link href="/dashboard/jobs">Post Job</Link>
            </Button>
            <SeedButton />
          </div>
      </div>

      <CandidateBoard candidates={candidates} />
    </main>
  );
}
