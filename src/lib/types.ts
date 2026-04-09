export type Stage = 'APPLIED' | 'SCREENED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

export type Candidate = {
  id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  stage: Stage;
  score: number;
  avatarUrl: string;
  rankingExplanation?: string;
};
