'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Candidate } from '@/lib/types';
import { createCandidateAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  jobDescription: z.string().min(50, {
    message: 'Job description must be at least 50 characters.',
  }),
  cvContent: z.string().min(50, {
    message: 'CV content must be at least 50 characters.',
  }),
});

type AddCandidateFormProps = {
  onCandidateAdded: (candidate: Candidate) => void;
  closeDialog: () => void;
};

export function AddCandidateForm({
  onCandidateAdded,
  closeDialog,
}: AddCandidateFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
      cvContent: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createCandidateAction(values);
    if (result.candidate) {
      toast({
        title: 'Analysis Complete',
        description: `${result.candidate.name} has been added to the pipeline.`,
      });
      onCandidateAdded(result.candidate);
      closeDialog();
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full job description here..."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cvContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Candidate CV</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full text of the candidate's CV here..."
                  className="min-h-[200px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Analyzing...' : 'Add and Analyze Candidate'}
        </Button>
      </form>
    </Form>
  );
}
