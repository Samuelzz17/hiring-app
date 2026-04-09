type ScoringResult = {
  fitScore: number;
  fitExplanation: string;
  extractedJson?: unknown;
};

function hasGenAiKey() {
  return Boolean(process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY);
}

function normalizeWords(text: string) {
  return (
    text
      .toLowerCase()
      .match(/[a-z0-9+#.-]{2,}/g)
      ?.map((w) => w.trim())
      .filter(Boolean) ?? []
  );
}

const STOPWORDS = new Set([
  'dan',
  'atau',
  'yang',
  'untuk',
  'dengan',
  'pada',
  'dari',
  'ke',
  'di',
  'the',
  'and',
  'or',
  'to',
  'of',
  'in',
  'for',
  'with',
  'a',
  'an',
  'as',
  'is',
  'are',
  'be',
  'will',
  'we',
  'you',
  'i',
  'it',
]);

function keywordScore(jobDescription: string, cvText: string): ScoringResult {
  const jobWords = normalizeWords(jobDescription).filter((w) => !STOPWORDS.has(w) && w.length >= 3);
  const cvWords = new Set(normalizeWords(cvText));

  const freq = new Map<string, number>();
  for (const w of jobWords) freq.set(w, (freq.get(w) ?? 0) + 1);

  const keywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .filter((w, i, arr) => arr.indexOf(w) === i)
    .slice(0, 40);

  const matched = keywords.filter((k) => cvWords.has(k));
  const expected = Math.min(20, Math.max(10, keywords.length));
  const score = Math.round((matched.length / expected) * 100);

  const missing = keywords.filter((k) => !cvWords.has(k)).slice(0, 8);
  const matchedTop = matched.slice(0, 10);

  const explanation = [
    `Fallback scoring (non-AI).`,
    `Matched keywords: ${matchedTop.length ? matchedTop.join(', ') : '—'}.`,
    missing.length ? `Missing keywords: ${missing.join(', ')}.` : `No major missing keywords detected.`,
  ].join(' ');

  return { fitScore: Math.max(0, Math.min(100, score)), fitExplanation: explanation };
}

export async function scoreApplicationFromCv(input: {
  jobDescription: string;
  cvText: string;
  candidate?: { name?: string; email?: string };
}): Promise<ScoringResult> {
  if (!process.env.GOOGLE_GENAI_API_KEY && process.env.GEMINI_API_KEY) {
    process.env.GOOGLE_GENAI_API_KEY = process.env.GEMINI_API_KEY;
  }

  if (hasGenAiKey()) {
    try {
      const { extractCandidateData } = await import('@/ai/flows/extract-candidate-data-flow');
      const { scoreCandidateFit } = await import('@/ai/flows/score-candidate-fit-flow');

      const extracted = await extractCandidateData({ cvContent: input.cvText });

      const cvDataForScoring = {
        name: extracted.name || input.candidate?.name || 'N/A',
        email: extracted.email || input.candidate?.email || 'N/A',
        phone: extracted.phone,
        summary: extracted.summary,
        skills: extracted.skills || [],
        experience:
          extracted.experience?.map((exp) => `${exp.title} at ${exp.company} (${exp.duration})`) || [],
        education:
          extracted.education?.map((edu) => `${edu.degree} from ${edu.institution} (${edu.duration})`) || [],
      };

      const scored = await scoreCandidateFit({
        cvData: cvDataForScoring,
        jobDescription: input.jobDescription,
      });

      return {
        fitScore: Math.max(0, Math.min(100, Math.round(scored.compatibilityScore))),
        fitExplanation: (scored.rankingExplanation || '').slice(0, 2000),
        extractedJson: extracted,
      };
    } catch {
      // fall through
    }
  }

  return keywordScore(input.jobDescription, input.cvText);
}

