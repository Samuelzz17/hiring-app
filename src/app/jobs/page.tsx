export const dynamic = "force-dynamic";

import Link from 'next/link';
import { listOpenJobs } from '@/db/recruiting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building2, Briefcase, MoveRight } from 'lucide-react';

export default async function JobsPage() {
  const jobs = await listOpenJobs();

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b px-6 py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 px-3 py-1">
            Career Opportunities
          </Badge>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">
            Temukan Karir Impianmu di <span className="text-primary">JobFlow</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Jelajahi berbagai posisi menarik. Kami mencari talenta terbaik untuk tumbuh bersama dalam lingkungan kerja yang inovatif.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Cari posisi atau departemen..."
            />
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl p-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Lowongan Terbaru
          </h2>
          <p className="text-sm text-slate-500 font-medium">{jobs.length} Posisi Tersedia</p>
        </div>

        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <Card className="border-dashed py-12 text-center">
              <CardContent>
                <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <CardTitle className="text-slate-700">Belum ada lowongan aktif</CardTitle>
                <CardDescription className="mt-2 max-w-xs mx-auto text-slate-500">
                  Cek kembali nanti atau hubungi tim rekrutmen kami untuk informasi lebih lanjut.
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 border-transparent hover:border-primary/20 overflow-hidden">
                <CardHeader className="pb-3 flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {job.department || "General"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {job.location || "On-site"}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Open</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-2 text-sm text-slate-600 mb-6 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {["Full-time", "Remote"].map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button asChild variant="default" className="gap-2">
                      <Link href={`/jobs/${job.id}`}>
                        Lihat Detail <MoveRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
