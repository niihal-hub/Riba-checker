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
    const body = await req.formData();
    const text = body.get('text') as string | null;
    const file = body.get('file') as File | null;

    let contentToAnalyze = text || '';

    if (file) {
      // Handle images and PDFs using Claude Vision
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = file.type;

      const model = process.env.MODEL_NAME || 'claude-3-haiku-20240307';
      const knowledge = await loadKnowledgeBase();

      const systemPrompt = `
You are an expert in Islamic Finance. Analyze this financial document for Riba, Gharar, or Maysir.
Crtitcal: Provide information, NOT fatwas.
If scholars differ, show both views.
Use simple English.

KNOWLEDGE BASE:
${knowledge}

Return ONLY a strict JSON object:
{
  "document_type": "string",
  "overall_status": "likely_ok" | "has_concerns" | "likely_not_ok" | "unclear",
  "confidence": "low" | "medium" | "high",
  "summary": "string",
  "flags": [{
    "quote": "string",
    "category": "riba" | "gharar" | "maysir" | "other",
    "severity": "low" | "medium" | "high",
    "why": "string",
    "scholars_differ": boolean,
    "halal_alternative": "string"
  }],
  "questions_for_scholar": ["string"]
}
`;

      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType === 'application/pdf' ? 'image/jpeg' : mimeType, // Claude handles PDFs as images internally in some versions, or we'd use a PDF parser
                  data: base64,
                },
              },
              { type: 'text', text: 'Please analyze this document for Sharia compliance regarding riba, gharar, and maysir.' },
            ],
          },
        ],
      });

      const resultText = response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonString = resultText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonString);
      return NextResponse.json(AnalysisResponseSchema.parse(parsed));
    }

    if (!contentToAnalyze) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    // Fallback for text-only
    const ruleFlags = runRuleBasedChecks(contentToAnalyze);
    const knowledge = await loadKnowledgeBase();
    const model = process.env.MODEL_NAME || 'claude-3-haiku-20240307';

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 2000,
      system: `You are an expert in Islamic Finance. Analyze this text for Riba, Gharar, and Maysir. Use this knowledge: ${knowledge}`,
      messages: [{ role: 'user', content: `Text: ${contentToAnalyze}\n\nRule Flags: ${JSON.stringify(ruleFlags)}` }],
    });

    const resultText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonString = resultText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonString);
    return NextResponse.json(AnalysisResponseSchema.parse(parsed));

  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Analysis failed.' }, { status: 500 });
  }
}
