# RibaCheck Project Rules

## Core Mission
A free, English-language web app helping ordinary people identify potential riba (interest), gharar (uncertainty), or maysir (gambling) in financial documents based on mainstream Islamic finance principles.

## Critical Constraints (Non-Negotiable)
1. **NOT A FATWA**: Every result MUST state: "This is general information. Ask a qualified scholar for a ruling."
2. **NEUTRALITY**: Where scholars differ (e.g., conventional insurance, credit card late fees), show BOTH views clearly. Do not pick a side.
3. **NO INVENTION**: Never invent rulings or standard numbers. If unsure, say "unclear" and guide the user to a scholar.
4. **PRIVACY**: Do NOT store uploaded documents or text. Process in memory only. Show a privacy note on the page.
5. **ACCESSIBILITY**: Use simple English. Short sentences. No jargon. Target: global audience with basic English.

## Tech Stack
- Next.js (App Router) + TypeScript + Tailwind
- Claude API (Key in `.env`, Model in `MODEL_NAME`)
- Rate Limiting: 10 checks per hour per IP.
- Validation: Zod for API responses.

## Development Workflow
- Phases: (a) Skeleton/UI $\rightarrow$ (b) Rule-based $\rightarrow$ (c) AI Analysis $\rightarrow$ (d) Uploads $\rightarrow$ (e) Tests $\rightarrow$ (f) Polish.
- Git: Clear commit messages.
- Verification: Run app/tests after each phase.
