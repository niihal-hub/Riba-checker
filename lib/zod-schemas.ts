import { z } from 'zod';

export const AnalysisResponseSchema = z.object({
  document_type: z.string(),
  overall_status: z.enum(['likely_ok', 'has_concerns', 'likely_not_ok', 'unclear']),
  confidence: z.enum(['low', 'medium', 'high']),
  summary: z.string().max(80),
  flags: z.array(z.object({
    quote: z.string(),
    category: z.enum(['riba', 'gharar', 'maysir', 'other']),
    severity: z.enum(['low', 'medium', 'high']),
    why: z.string(),
    scholars_differ: z.boolean(),
    halal_alternative: z.string(),
  })),
  questions_for_scholar: z.array(z.string()),
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;
