import { NextRequest, NextResponse } from 'next/server';
import { runRuleBasedChecks } from '@/lib/analysis/rules';
import { loadKnowledgeBase } from '@/lib/analysis/knowledge';
import { AnalysisResponseSchema } from '@/lib/zod-schemas';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // 1. Rule-based checks (Deterministic)
    const ruleFlags = runRuleBasedChecks(text);

    // 2. Load Knowledge Base
    const knowledge = await loadKnowledgeBase();

    // 3. Call Claude
    const model = process.env.MODEL_NAME || 'claude-3-haiku-20240307';

    const systemPrompt = `
You are an expert in Islamic Finance. Your task is to analyze financial documents for potential Riba (interest), Gharar (uncertainty), or Maysir (gambling).

CRITICAL RULES:
1. You provide information, NOT fatwas.
2. If scholars differ on a point, you MUST state that they differ.
3. Do not invent rulings or numbers.
4. Use simple English. Short sentences.
5. Always include a reminder to ask a qualified scholar.

KNOWLEDGE BASE:
${knowledge}

OUTPUT FORMAT:
You must return ONLY a valid JSON object matching this schema:
{
  "document_type": "string",
  "overall_status": "likely_ok" | "has_concerns" | "likely_not_ok" | "unclear",
  "confidence": "low" | "medium" | "high",
  "summary": "string (max 80 words)",
  "flags": [{
    "quote": "exact text from document",
    "category": "riba" | "gharar" | "maysir" | "other",
    "severity": "low" | "medium" | "high",
    "why": "simple explanation",
    "scholars_differ": boolean,
    "halal_alternative": "string"
  }],
  "questions_for_scholar": ["string"]
}
`;

    const userPrompt = `
DOCUMENT TEXT:
${text}

PRELIMINARY RULE-BASED FLAGS:
${JSON.stringify(ruleFlags)}

Please analyze the document. If the rule-based flags are correct, include them in your final JSON. If you find new issues, add them. If a rule-based flag is actually okay in context, exclude it.
`;

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    // Clean JSON (remove markdown blocks if present)
    const jsonString = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    // Validate with Zod
    const validated = AnalysisResponseSchema.parse(parsed);

    return NextResponse.json(validated);

  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
