export const dynamic = "force-dynamic";

import { getSystemStats, listBoardCandidates } from '@/db/recruiting';
import { StatsGrid } from '@/components/dashboard/stats-cards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Users, Briefcase, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardOverviewPage() {
  const stats = await getSystemStats();
  const recentApps = await listBoardCandidates();
  const topRecent = recentApps.slice(0, 5);

  return (
    <main className="space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening in your recruitment funnel.</p>
      </div>

      <StatsGrid 
        totalJobs={stats.totalJobs}
        activeApplications={stats.activeApplications}
        totalEmployees={stats.totalEmployees}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest candidates who applied to your open positions.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/candidates" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRecent.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent applications found.</p>
              ) : (
                topRecent.map((app) => (
                  <div key={app.applicationId} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{app.candidateName}</p>
                      <p className="text-xs text-muted-foreground">Applied for {app.jobTitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={app.fitScore > 80 ? "default" : "secondary"}>
                        {app.fitScore}% Fit
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for recruitment management.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start gap-2" asChild>
              <Link href="/dashboard/jobs">
                <Briefcase className="h-4 w-4" /> Post a new job opening
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2" asChild>
              <Link href="/dashboard/candidates">
                <Users className="h-4 w-4" /> Review candidate board
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2" asChild>
              <Link href="/dashboard/employees">
                <UserCheck className="h-4 w-4" /> Manage employee onboarding
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
