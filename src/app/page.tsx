'use client';

import { useState } from 'react';
import CandidateBoard from '@/components/jobflow/candidate-board';
import Header from '@/components/jobflow/header';
import { MOCK_CANDIDATES } from '@/lib/mock-data';
import type { Candidate } from '@/lib/types';

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);

  const handleAddCandidate = (newCandidate: Candidate) => {
    setCandidates((prevCandidates) => [newCandidate, ...prevCandidates]);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header onCandidateAdded={handleAddCandidate} />
      <main className="flex-1 overflow-x-auto p-4 md:p-6">
        <CandidateBoard candidates={candidates} />
      </main>
    </div>
  );
}
