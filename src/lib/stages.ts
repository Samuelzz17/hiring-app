import type { Stage } from '@/lib/types';

export const STAGES: Stage[] = ['APPLIED', 'SCREENED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

export const STAGE_LABEL: Record<Stage, string> = {
  APPLIED: 'Applied',
  SCREENED: 'Screened',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

