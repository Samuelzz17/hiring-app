export const dynamic = "force-dynamic";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJob } from '@/db/recruiting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, MapPin, Building2, Calendar, Share2, Info, CheckCircle2 } from 'lucide-react';

export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = await getJob(params.jobId);
  if (!job) return notFound();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="mx-auto w-full max-w-5xl px-6 h-14 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 text-slate-500 hover:text-slate-900">
            <Link href="/jobs">
              <ChevronLeft className="h-4 w-4" /> Kembali ke Lowongan
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl p-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {job.status === 'OPEN' ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">Hiring Now</Badge>
                ) : (
                  <Badge variant="secondary">{job.status}</Badge>
                )}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Diposting {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-slate-900">{job.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-sm">{job.department || "General"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium text-sm">{job.location || "On-site"}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Deskripsi Pekerjaan
                </h3>
                <div className="bg-white rounded-xl p-6 border shadow-sm whitespace-pre-wrap text-slate-600 leading-relaxed">
                  {job.description}
                </div>
              </section>

              {job.requirements && (
                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Kualifikasi & Persyaratan
                  </h3>
                  <div className="bg-white rounded-xl p-6 border shadow-sm whitespace-pre-wrap text-slate-600 leading-relaxed">
                    {job.requirements}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar / CTA */}
          <div className="md:col-span-1">
            <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Tertarik dengan posisi ini?</CardTitle>
                <CardDescription>
                  Klik tombol di bawah untuk mengisi formulir lamaran.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Proses seleksi cepat</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Dukungan AI Recruiting</span>
                  </div>
                </div>
                
                <Button asChild className="w-full h-11 text-base font-semibold" disabled={job.status !== 'OPEN'}>
                  <Link href={`/jobs/${job.id}/apply`}>Lamar Sekarang</Link>
                </Button>
                
                <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
                  Batas waktu tidak ditentukan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
