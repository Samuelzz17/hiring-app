export const dynamic = "force-dynamic";

import { listEmployees } from '@/db/recruiting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { setEmployeeStartDateAction } from '@/app/_actions/recruiting';

export default async function EmployeesPage() {
  const employees = await listEmployees();

  return (
    <main className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold">Employees</h1>
        <p className="text-muted-foreground">Terbuat otomatis ketika aplikasi dipindahkan ke stage Hired.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>Set start date jika diperlukan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {employees.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada employee.</p>
          ) : (
            employees.map((e) => (
              <div key={e.id} className="flex flex-col justify-between gap-2 rounded-md border p-3 md:flex-row md:items-center">
                <div className="min-w-0">
                  <div className="truncate font-medium">{e.candidateName}</div>
                  <div className="text-sm text-muted-foreground">
                    {e.candidateEmail} • {e.jobTitle}
                  </div>
                </div>

                <form action={setEmployeeStartDateAction} className="flex items-center gap-2">
                  <input type="hidden" name="employeeId" value={e.id} />
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={e.startDate ? e.startDate.slice(0, 10) : ''}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    Save
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
