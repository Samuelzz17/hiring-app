export type Stage = 'Applied' | 'Shortlisted' | 'Interview' | 'Hired';

export type Candidate = {
  id: string;
  name: string;
  email: string;
  stage: Stage;
  score: number;
  avatarUrl: string;
  rankingExplanation?: string;
};
