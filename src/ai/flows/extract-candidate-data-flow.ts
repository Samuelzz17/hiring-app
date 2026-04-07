'use server';
/**
 * @fileOverview A Genkit flow for extracting key candidate information from a CV.
 *
 * - extractCandidateData - A function that handles the CV parsing process.
 * - ExtractCandidateDataInput - The input type for the extractCandidateData function.
 * - ExtractCandidateDataOutput - The return type for the extractCandidateData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractCandidateDataInputSchema = z.object({
  cvContent: z.string().describe('The full text content of the candidate\'s CV.'),
});
export type ExtractCandidateDataInput = z.infer<typeof ExtractCandidateDataInputSchema>;

const ExtractCandidateDataOutputSchema = z.object({
  name: z.string().describe('The full name of the candidate.').optional(),
  email: z.string().email().describe('The email address of the candidate.').optional(),
  phone: z.string().describe('The phone number of the candidate.').optional(),
  linkedIn: z.string().url().describe('The LinkedIn profile URL of the candidate.').optional(),
  skills: z.array(z.string()).describe('A list of key skills possessed by the candidate.').optional(),
  experience: z.array(
    z.object({
      title: z.string().describe('The job title or role.'),
      company: z.string().describe('The company name.'),
      duration: z.string().describe('The duration of employment (e.g., "Jan 2020 - Dec 2022", "2020 - Present").'),
      description: z.string().describe('A summary of responsibilities and achievements in this role.').optional(),
    })
  ).describe('A list of work experiences.').optional(),
  education: z.array(
    z.object({
      degree: z.string().describe('The degree obtained (e.g., "Master of Science", "B.A.").'),
      institution: z.string().describe('The educational institution.'),
      duration: z.string().describe('The duration of study (e.g., "Sep 2018 - May 2022").'),
    })
  ).describe('A list of educational background.').optional(),
  summary: z.string().describe('A brief professional summary or objective from the CV.').optional(),
});
export type ExtractCandidateDataOutput = z.infer<typeof ExtractCandidateDataOutputSchema>;

export async function extractCandidateData(input: ExtractCandidateDataInput): Promise<ExtractCandidateDataOutput> {
  return extractCandidateDataFlow(input);
}

const extractCandidateDataPrompt = ai.definePrompt({
  name: 'extractCandidateDataPrompt',
  input: { schema: ExtractCandidateDataInputSchema },
  output: { schema: ExtractCandidateDataOutputSchema },
  prompt: `You are an expert HR assistant tasked with extracting key information from a candidate's Curriculum Vitae (CV).

Carefully read the provided CV content and extract the candidate's name, contact details (email, phone, LinkedIn), a list of their skills, their work experience, and their educational background.

For work experience, extract the job title, company, duration, and a brief description of responsibilities/achievements. For education, extract the degree, institution, and duration.

Return the extracted information in a structured JSON format as described in the output schema. If a piece of information is not present or cannot be reliably extracted, omit that field from the output.

CV Content:
{{cvContent}}`,
});

const extractCandidateDataFlow = ai.defineFlow(
  {
    name: 'extractCandidateDataFlow',
    inputSchema: ExtractCandidateDataInputSchema,
    outputSchema: ExtractCandidateDataOutputSchema,
  },
  async (input) => {
    const { output } = await extractCandidateDataPrompt(input);
    if (!output) {
      throw new Error('Failed to extract candidate data from CV.');
    }
    return output;
  }
);
