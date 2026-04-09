'use server';
/**
 * @fileOverview A Genkit flow for scoring candidate fit against a job description.
 *
 * - scoreCandidateFit - A function that handles the candidate fit scoring process.
 * - ScoreCandidateFitInput - The input type for the scoreCandidateFit function.
 * - ScoreCandidateFitOutput - The return type for the scoreCandidateFit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreCandidateFitInputSchema = z.object({
  cvData: z.object({
    name: z.string().describe('The name of the candidate.'),
    email: z.string().email().describe('The email of the candidate.'),
    phone: z.string().optional().describe('The phone number of the candidate.'),
    skills: z.array(z.string()).describe('A list of skills extracted from the CV.').default([]),
    experience: z.array(z.string()).describe('A list of work experience entries from the CV.').default([]),
    education: z.array(z.string()).describe('A list of educational background entries from the CV.').default([]),
    summary: z.string().optional().describe('A summary or objective from the CV.'),
    // Add other relevant CV fields as needed
  }).describe('Extracted key information from the candidate\'s CV.'),
  jobDescription: z.string().describe('The full job description for the role.'),
});
export type ScoreCandidateFitInput = z.infer<typeof ScoreCandidateFitInputSchema>;

const ScoreCandidateFitOutputSchema = z.object({
  compatibilityScore: z.number().min(0).max(100).describe('A numerical score (0-100) indicating how well the candidate\'s CV matches the job description.'),
  rankingExplanation: z.string().describe('A detailed explanation of the compatibility score, highlighting key matches and mismatches.'),
});
export type ScoreCandidateFitOutput = z.infer<typeof ScoreCandidateFitOutputSchema>;

export async function scoreCandidateFit(input: ScoreCandidateFitInput): Promise<ScoreCandidateFitOutput> {
  return scoreCandidateFitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreCandidateFitPrompt',
  input: {schema: ScoreCandidateFitInputSchema},
  output: {schema: ScoreCandidateFitOutputSchema},
  prompt: `You are an HR assistant specializing in candidate screening.
Your task is to analyze a candidate's extracted CV data against a given job description and provide a compatibility score and a detailed explanation.

Important constraints:
- Use ONLY job-relevant information (skills, experience, education, certifications, portfolio/projects, domain knowledge).
- Do NOT consider protected or sensitive attributes (e.g., age, gender, race/ethnicity, religion, nationality, disability, marital status, pregnancy, political views) even if mentioned.
- Do NOT infer any protected attributes.
- If the job description contains potentially discriminatory requirements, ignore them and focus on legitimate job requirements.

First, carefully review the Job Description and the Candidate's CV Data.
Then, provide a compatibility score between 0 and 100, where 100 is a perfect match.
Finally, provide a comprehensive ranking explanation, detailing why the candidate received that score, specifically mentioning matching skills, experience, and education, as well as any gaps.

Job Description:
{{{jobDescription}}}

Candidate's CV Data:
Name: {{{cvData.name}}}
Email: {{{cvData.email}}}
Phone: {{{cvData.phone}}}
Summary: {{{cvData.summary}}}
Skills:
{{#each cvData.skills}}- {{{this}}}
{{/each}}
Experience:
{{#each cvData.experience}}- {{{this}}}
{{/each}}
Education:
{{#each cvData.education}}- {{{this}}}
{{/each}}
`,
});

const scoreCandidateFitFlow = ai.defineFlow(
  {
    name: 'scoreCandidateFitFlow',
    inputSchema: ScoreCandidateFitInputSchema,
    outputSchema: ScoreCandidateFitOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
