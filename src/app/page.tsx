import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold">JobFlow</h1>
        <p className="text-muted-foreground">
          Sistem lamaran kerja end-to-end: post job → kandidat apply + upload CV → ATS parsing + fit score → kandidat
          board → hired → employee.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Public Job Board</CardTitle>
            <CardDescription>Halaman lowongan untuk kandidat.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/jobs">Lihat Lowongan</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Kelola kandidat, stage, job, dan employee.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Buka Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
