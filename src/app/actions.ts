'use server';

import { z } from 'zod';
import { extractCandidateData } from '@/ai/flows/extract-candidate-data-flow';
import { scoreCandidateFit } from '@/ai/flows/score-candidate-fit-flow';
import type { Candidate } from '@/lib/types';

const formSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  cvContent: z.string().min(50, 'CV content must be at least 50 characters.'),
});

type ActionState = {
  message: string;
  candidate?: Candidate;
  errors?: {
    jobDescription?: string[];
    cvContent?: string[];
    _general?: string[];
  };
};

export async function createCandidateAction(
  values: { jobDescription: string; cvContent: string }
): Promise<ActionState> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { jobDescription, cvContent } = validatedFields.data;

  try {
    const extractedData = await extractCandidateData({ cvContent });

    if (!extractedData || !extractedData.name) {
      return { message: 'Failed to extract key information from CV. Please ensure the CV is well-formatted.' };
    }

    const cvDataForScoring = {
      name: extractedData.name || 'N/A',
      email: extractedData.email || 'N/A',
      phone: extractedData.phone,
      summary: extractedData.summary,
      skills: extractedData.skills || [],
      experience: extractedData.experience?.map(exp => `${exp.title} at ${exp.company} (${exp.duration})`) || [],
      education: extractedData.education?.map(edu => `${edu.degree} from ${edu.institution} (${edu.duration})`) || [],
    };
    
    const scoreResult = await scoreCandidateFit({
      cvData: cvDataForScoring,
      jobDescription,
    });

    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: extractedData.name,
      email: extractedData.email || 'no-email@provided.com',
      stage: 'Applied',
      score: scoreResult.compatibilityScore,
      rankingExplanation: scoreResult.rankingExplanation,
      avatarUrl: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/40/40`,
    };

    return { message: 'Candidate added successfully.', candidate: newCandidate };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Failed to process candidate: ${errorMessage}` };
  }
}
