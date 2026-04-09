import Link from 'next/link';
import { notFound } from 'next/navigation';
import { applyToJobAction } from '@/app/_actions/recruiting';
import { getJob } from '@/db/recruiting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default async function ApplyPage({ params }: { params: { jobId: string } }) {
  const job = await getJob(params.jobId);
  if (!job) return notFound();

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="font-headline text-2xl font-bold">Apply: {job.title}</h1>
          <p className="text-sm text-muted-foreground">Isi formulir dan upload CV (PDF/DOCX/TXT).</p>
        </div>
        <Button variant="secondary" asChild>
          <Link href={`/jobs/${job.id}`}>Kembali</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Lamaran</CardTitle>
          <CardDescription>
            CV akan diparsing (ATS) dan otomatis dihitung fit score terhadap job ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={applyToJobAction} className="grid gap-4">
            <input type="hidden" name="jobId" value={job.id} />

            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" placeholder="Nama lengkap" required />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="nama@email.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">No. HP (opsional)</Label>
                <Input id="phone" name="phone" placeholder="+62..." />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkedIn">LinkedIn (opsional)</Label>
              <Input id="linkedIn" name="linkedIn" placeholder="https://linkedin.com/in/..." />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cvFile">Upload CV</Label>
              <Input id="cvFile" name="cvFile" type="file" accept=".pdf,.docx,.txt" />
              <p className="text-xs text-muted-foreground">
                Jika tidak upload file, boleh paste CV text di bawah.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cvText">CV Text (opsional)</Label>
              <Textarea id="cvText" name="cvText" rows={6} placeholder="Paste isi CV..." />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={job.status !== 'OPEN'}>
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
