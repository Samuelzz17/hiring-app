'use client';

import type { Candidate } from '@/lib/types';
import StageColumn from './stage-column';
import { STAGES } from '@/lib/stages';

type CandidateBoardProps = {
  candidates: Candidate[];
};

export default function CandidateBoard({ candidates }: CandidateBoardProps) {
  return (
    <div className="flex overflow-x-auto pb-6 gap-6 items-start min-h-[600px] w-full snap-x">
      {STAGES.map((stage) => {
        const candidatesInStage = candidates.filter((c) => c.stage === stage);
        return (
          <StageColumn
            key={stage}
            title={stage}
            candidates={candidatesInStage}
          />
        );
      })}
    </div>
  );
}
