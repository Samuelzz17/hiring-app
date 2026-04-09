import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJob } from '@/db/recruiting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = await getJob(params.jobId);
  if (!job) return notFound();

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <h1 className="font-headline text-3xl font-bold">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {job.department ? <span>{job.department}</span> : null}
            {job.location ? <span>• {job.location}</span> : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {job.status === 'OPEN' ? <Badge>Open</Badge> : <Badge variant="secondary">{job.status}</Badge>}
          <Button variant="secondary" asChild>
            <Link href="/jobs">Kembali</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Deskripsi</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">{job.description}</CardContent>
        </Card>
        {job.requirements ? (
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">{job.requirements}</CardContent>
          </Card>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <Button asChild disabled={job.status !== 'OPEN'}>
            <Link href={`/jobs/${job.id}/apply`}>Apply</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
