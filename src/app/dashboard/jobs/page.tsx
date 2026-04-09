import { createJobAction, updateJobStatusAction } from '@/app/_actions/recruiting';
import { listJobs } from '@/db/recruiting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default async function DashboardJobsPage() {
  const jobs = await listJobs();

  return (
    <main className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold">Jobs</h1>
        <p className="text-muted-foreground">Post job dan kelola status (Open / Closed / Draft).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Job</CardTitle>
          <CardDescription>Job akan muncul di halaman publik jika status = Open.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createJobAction} className="grid gap-4">
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Software Engineer" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Remote / Makassar" />
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" placeholder="Engineering" />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <select
                  name="status"
                  defaultValue="OPEN"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="OPEN">Open</option>
                  <option value="DRAFT">Draft</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Tulis deskripsi pekerjaan..." rows={6} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requirements">Requirements (optional)</Label>
              <Textarea id="requirements" name="requirements" placeholder="Skill/requirement yang dicari..." rows={4} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Publish</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job List</CardTitle>
          <CardDescription>Quick actions untuk buka/tutup lowongan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada job.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="flex flex-col justify-between gap-2 rounded-md border p-3 md:flex-row md:items-center">
                <div className="min-w-0">
                  <div className="truncate font-medium">{job.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {job.status}
                    {job.location ? ` • ${job.location}` : ''}
                    {job.department ? ` • ${job.department}` : ''}
                  </div>
                </div>
                <form action={updateJobStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="jobId" value={job.id} />
                  <select
                    name="status"
                    defaultValue={job.status}
                    className="h-10 w-[160px] rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="OPEN">Open</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <Button type="submit" variant="secondary">
                    Update
                  </Button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}
