'use client';
import type { Candidate } from '@/lib/types';
import { AddCandidateDialog } from './add-candidate-dialog';

type HeaderProps = {
  onCandidateAdded: (candidate: Candidate) => void;
};

export default function Header({ onCandidateAdded }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-primary"
        >
          <path d="M12 12h-2" />
          <path d="M15 19.5c-1.25-1.25-3-2.5-4-2.5s-2.75 1.25-4 2.5" />
          <path d="M15 10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1" />
          <path d="M19 14.5c1.25-1.25 2-2.5 2-3.5A2.5 2.5 0 0 0 18.5 8" />
          <path d="M5 14.5c-1.25-1.25-2-2.5-2-3.5A2.5 2.5 0 0 1 5.5 8" />
        </svg>
        <h1 className="font-headline text-2xl font-bold">JobFlow</h1>
      </div>
      <AddCandidateDialog onCandidateAdded={onCandidateAdded} />
    </header>
  );
}
