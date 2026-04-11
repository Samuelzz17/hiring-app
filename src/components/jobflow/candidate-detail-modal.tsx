"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApplicationDetails } from "@/app/_actions/candidate-details";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Loader2, Star } from "lucide-react";

interface CandidateDetailModalProps {
  applicationId: string;
  candidateName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateDetailModal({ applicationId, candidateName, open, onOpenChange }: CandidateDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && applicationId && !data) {
      setLoading(true);
      setError(null);
      getApplicationDetails(applicationId)
        .then((res) => {
          if (res.success) {
            setData(res.data);
          } else {
            setError(res.error || "Failed to load details");
          }
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [open, applicationId, data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl">{candidateName}</DialogTitle>
          <DialogDescription>
            Detailed application overview and AI extraction analysis
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Fetching detailed insights...</p>
          </div>
        ) : error ? (
          <div className="flex-1 p-6 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : data ? (
          <Tabs defaultValue="extracted" className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="extracted">AI Analysis</TabsTrigger>
                <TabsTrigger value="document">Original Document</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-4">
              <TabsContent value="extracted" className="m-0 space-y-6">
                
                {/* Score Section */}
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-700">Fit Score</h3>
                    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border shadow-sm">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold">{data.fitScore}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {data.fitExplanation}
                  </p>
                </div>

                {/* AI Extracted JSON */}
                {data.extractedJson && (
                  <div className="space-y-6">
                    {data.extractedJson.summary && (
                      <div>
                        <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Summary</h3>
                        <p className="text-sm text-slate-800 leading-relaxed">{data.extractedJson.summary}</p>
                      </div>
                    )}

                    {data.extractedJson.skills && data.extractedJson.skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {data.extractedJson.skills.map((skill: string, i: number) => (
                            <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.extractedJson.experience && data.extractedJson.experience.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-3">Work Experience</h3>
                        <div className="space-y-4">
                          {data.extractedJson.experience.map((exp: any, i: number) => (
                            <div key={i} className="pl-4 border-l-2 border-slate-200">
                              <h4 className="font-semibold text-sm">{exp.title}</h4>
                              <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                                <span>{exp.company}</span>
                                <span>{exp.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.extractedJson.education && data.extractedJson.education.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-3">Education</h3>
                        <div className="space-y-4">
                          {data.extractedJson.education.map((edu: any, i: number) => (
                            <div key={i} className="pl-4 border-l-2 border-slate-200">
                              <h4 className="font-semibold text-sm">{edu.degree}</h4>
                              <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                                <span>{edu.institution}</span>
                                <span>{edu.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="document" className="m-0 space-y-4">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl border-slate-200 bg-slate-50/50">
                   <FileText className="h-16 w-16 text-slate-300 mb-4" />
                   <h3 className="font-medium text-slate-700 mb-2">{data.cvFileName || 'Uploaded Resume'}</h3>
                   
                   {data.cvDownloadUrl ? (
                     <div className="flex gap-3 mt-4">
                       <Button asChild onClick={(e) => e.stopPropagation()}>
                         <a href={data.cvDownloadUrl} target="_blank" rel="noopener noreferrer">
                           Open PDF
                         </a>
                       </Button>
                       <Button variant="outline" asChild onClick={(e) => e.stopPropagation()}>
                         <a href={data.cvDownloadUrl} download={data.cvFileName || 'resume.pdf'}>
                           <Download className="h-4 w-4 mr-2" /> Download
                         </a>
                       </Button>
                     </div>
                   ) : (
                     <p className="text-sm text-muted-foreground mt-2">No file attachment available in storage.</p>
                   )}
                </div>

                {data.cvText && !data.cvDownloadUrl && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Raw Text Fallback</h3>
                    <div className="bg-slate-100 p-4 rounded-md text-xs font-mono text-slate-600 whitespace-pre-wrap">
                      {data.cvText}
                    </div>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
