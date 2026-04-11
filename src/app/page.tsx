"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function Home() {
  const { user, profile } = useAuth();
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h1 className="font-headline text-3xl font-bold">JobFlow</h1>
          <p className="text-sm text-muted-foreground">AI-Powered Job Application System</p>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{profile?.displayName || user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{profile?.role || 'User'}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => auth && signOut(auth)}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Public Job Board</CardTitle>
            <CardDescription>Job listing page for candidates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/jobs">View Jobs</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Manage candidates, stages, jobs, and employees.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
