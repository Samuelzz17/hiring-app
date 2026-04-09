import Link from 'next/link';
import { listOpenJobs } from '@/db/recruiting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function JobsPage() {
  const jobs = await listOpenJobs();

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Lowongan</h1>
          <p className="text-muted-foreground">Pilih posisi dan submit lamaran + CV.</p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Belum ada lowongan</CardTitle>
              <CardDescription>Silakan buat job di dashboard.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <Badge>Open</Badge>
                </div>
                <CardDescription className="flex flex-wrap gap-2">
                  {job.department ? <span>{job.department}</span> : null}
                  {job.location ? <span>• {job.location}</span> : null}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                <Button asChild>
                  <Link href={`/jobs/${job.id}`}>Detail</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
