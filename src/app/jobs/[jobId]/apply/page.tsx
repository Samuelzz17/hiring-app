import Link from 'next/link';
import { notFound } from 'next/navigation';
import { applyToJobAction } from '@/app/_actions/recruiting';
import { getJob } from '@/db/recruiting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Linkedin, FileUp, ClipboardList, Info, ChevronLeft, CheckCircle2, Building2, MapPin } from 'lucide-react';

export default async function ApplyPage({ params }: { params: { jobId: string } }) {
  const job = await getJob(params.jobId);
  if (!job) return notFound();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="mx-auto w-full max-w-5xl px-6 h-14 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 text-slate-500 hover:text-slate-900">
            <Link href={`/jobs/${job.id}`}>
              <ChevronLeft className="h-4 w-4" /> Kembali ke Detail
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Form Aplikasi
            </Badge>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl p-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-1">
              <h1 className="font-headline text-3xl font-bold text-slate-900">Kirim Lamaran</h1>
              <p className="text-slate-500">Silakan lengkapi data diri Anda dan lampirkan CV terbaru.</p>
            </div>

            <form action={applyToJobAction} className="space-y-6">
              <input type="hidden" name="jobId" value={job.id} />

              <Card>
                <CardHeader className="pb-4 border-b bg-slate-50/30">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg text-slate-800">Informasi Pribadi</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="name" name="name" placeholder="John Doe" className="pl-10 h-11" required />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input id="email" name="email" type="email" placeholder="john@example.com" className="pl-10 h-11" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">No. HP (WhatsApp)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input id="phone" name="phone" placeholder="+62 812..." className="pl-10 h-11" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="linkedIn" className="text-sm font-semibold text-slate-700">Profil LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="linkedIn" name="linkedIn" placeholder="https://linkedin.com/in/username" className="pl-10 h-11" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4 border-b bg-slate-50/30">
                  <div className="flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg text-slate-800">Lampiran CV (PDF)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid gap-4">
                    <Label htmlFor="cvFile" className="text-sm font-semibold text-slate-700">Upload File</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all text-center cursor-pointer group relative">
                      <Input 
                        id="cvFile" 
                        name="cvFile" 
                        type="file" 
                        accept=".pdf,.docx,.txt" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="space-y-2">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                          <FileUp className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                        </div>
                        <p className="font-medium text-slate-700">Klik atau tarik file ke sini untuk upload</p>
                        <p className="text-xs text-slate-400">PDF, DOCX, atau TXT (Max. 10MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-slate-400 font-bold">Atau</span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cvText" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" /> Paste Isi CV (Opsional)
                    </Label>
                    <Textarea 
                      id="cvText" 
                      name="cvText" 
                      rows={8} 
                      placeholder="Jika tidak ingin upload file, Anda bisa langsung paste isi CV di sini..." 
                      className="bg-slate-50/50 resize-none font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20" disabled={job.status !== 'OPEN'}>
                  Kirim Lamaran Sekarang
                </Button>
                <p className="text-[11px] text-center text-slate-400">
                  Dengan menekan tombol di atas, Anda menyetujui data Anda diolah untuk keperluan rekrutmen.
                </p>
              </div>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-primary/5 border-primary/10 overflow-hidden">
               <div className="p-4 bg-primary/10 border-b border-primary/10">
                 <h3 className="font-bold text-primary flex items-center gap-2">
                    <Info className="h-4 w-4" /> Mengapa PDF?
                 </h3>
               </div>
               <CardContent className="p-4 text-sm text-slate-600 space-y-3">
                  <p>Sistem AI kami dapat menganalisis format PDF dengan lebih akurat untuk menghitung skor kecocokan Anda.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-1 text-primary" />
                      <span>Format tetap terjaga</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-1 text-primary" />
                      <span>Parsing data lebih cepat</span>
                    </li>
                  </ul>
               </CardContent>
            </Card>

            <div className="p-6 border rounded-xl bg-white space-y-4">
              <h4 className="font-bold text-slate-800 border-b pb-2">Posisi Yang Dilamar</h4>
              <div className="space-y-2">
                <p className="font-bold text-primary">{job.title}</p>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex items-center gap-2"><Building2 className="h-3 w-3" /> {job.department}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {job.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
