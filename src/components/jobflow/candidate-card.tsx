import type { Candidate } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Star } from 'lucide-react';
import { STAGES, STAGE_LABEL } from '@/lib/stages';
import { updateApplicationStageAction } from '@/app/_actions/recruiting';
import { useRef } from 'react';

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const formRef = useRef<HTMLFormElement | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <Card className="group/card transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar>
          <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
          <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">{candidate.name}</CardTitle>
          <CardDescription className="text-sm">{candidate.email}</CardDescription>
          <div className="mt-1 truncate text-xs text-muted-foreground">{candidate.jobTitle}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Fit Score</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold">{candidate.score}</span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-2">
                <Progress value={candidate.score} aria-label={`${candidate.score}% compatibility`} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs whitespace-pre-wrap text-xs">
                {candidate.rankingExplanation ? candidate.rankingExplanation : '—'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <form ref={formRef} action={updateApplicationStageAction} className="mt-3 flex items-center gap-2">
          <input type="hidden" name="applicationId" value={candidate.applicationId} />
          <label className="text-xs text-muted-foreground">Stage</label>
          <select
            name="stage"
            defaultValue={candidate.stage}
            className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs"
            onChange={() => formRef.current?.requestSubmit()}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
        </form>
      </CardContent>
    </Card>
  );
}
