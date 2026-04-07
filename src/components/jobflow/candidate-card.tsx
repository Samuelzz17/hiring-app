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
import { Button } from '@/components/ui/button';
import { GripVertical, MoreVertical, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const handleAction = (action: string) => {
    toast({
      title: 'Action Triggered',
      description: `${action} for ${candidate.name}.`,
    });
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
        </div>
        <div className="flex items-center gap-1">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction('View details')}>View Details</DropdownMenuItem>
              {candidate.stage === 'Interview' && <DropdownMenuItem onClick={() => handleAction('Schedule Interview')}>Schedule Interview</DropdownMenuItem>}
              <DropdownMenuItem onClick={() => handleAction('Send email')}>Send Email</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => handleAction('Archive Candidate')}>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground transition-opacity group-hover/card:opacity-100 md:opacity-0" />
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
              <p>{candidate.rankingExplanation}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
