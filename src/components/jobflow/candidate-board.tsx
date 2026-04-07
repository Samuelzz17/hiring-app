import type { Candidate, Stage } from '@/lib/types';
import StageColumn from './stage-column';

const STAGES: Stage[] = ['Applied', 'Shortlisted', 'Interview', 'Hired'];

type CandidateBoardProps = {
  candidates: Candidate[];
};

export default function CandidateBoard({ candidates }: CandidateBoardProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-4">
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
