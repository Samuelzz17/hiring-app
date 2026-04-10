"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Users, Briefcase, UserCheck, Globe, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/auth/login?role=admin");
    }
  }, [loading, isAdmin, router]);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Candidates', href: '/dashboard/candidates', icon: Users },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Employees', href: '/dashboard/employees', icon: UserCheck },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
              <span className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs">J</span>
              JobFlow
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
              <Link href="/jobs">
                <Globe className="h-4 w-4" />
                Public Jobs
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8">
          <div className="md:hidden">
             {/* Mobile menu could go here */}
             <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
             </Button>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="text-right">
              <p className="text-sm font-medium leading-none">{profile?.displayName || 'Admin'}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{profile?.role}</p>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

