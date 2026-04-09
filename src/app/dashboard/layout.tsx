import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-headline text-lg font-bold">
              JobFlow
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Candidates</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/jobs">Jobs</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/employees">Employees</Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href="/jobs">Public Jobs</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl p-4">{children}</div>
    </div>
  );
}

