import type { Candidate, Stage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandidateCard } from './candidate-card';
import { ScrollArea } from '@/components/ui/scroll-area';

type StageColumnProps = {
  title: Stage;
  candidates: Candidate[];
};

export default function StageColumn({ title, candidates }: StageColumnProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>{title}</span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground">
            {candidates.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-2">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 p-2">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))
            ) : (
              <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-border text-sm text-muted-foreground">
                No candidates yet
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
