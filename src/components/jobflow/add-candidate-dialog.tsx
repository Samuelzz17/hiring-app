'use client';
import { useState } from 'react';
import type { Candidate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddCandidateForm } from './add-candidate-form';
import { Plus } from 'lucide-react';

type AddCandidateDialogProps = {
  onCandidateAdded: (candidate: Candidate) => void;
};

export function AddCandidateDialog({ onCandidateAdded }: AddCandidateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Paste the job description and candidate's CV to automatically score their compatibility.
          </DialogDescription>
        </DialogHeader>
        <AddCandidateForm
          onCandidateAdded={onCandidateAdded}
          closeDialog={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
