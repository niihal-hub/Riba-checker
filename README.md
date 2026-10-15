# RibaCheck 🌙

RibaCheck is a free, English-language web app that helps users identify potential riba (interest), gharar (uncertainty), or maysir (gambling) in financial documents based on mainstream Islamic finance principles.

## ⚠️ Important Notice
**This tool provides general information only. It is NOT a fatwa service.** Every result explicitly directs users to consult a qualified Islamic scholar for a formal ruling.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Validation**: Zod
- **Deployment**: Vercel

## Setup & Deployment

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```env
ANTHROPIC_API_KEY=your_api_key_here
MODEL_NAME=claude-3-haiku-20240307
```

### 2. Installation
```bash
npm install
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Deploy to Vercel
Push the code to GitHub and connect the repository to Vercel. Add the environment variables in the Vercel dashboard.

## Project Structure
- `/app`: Next.js pages and API routes.
- `/components`: Reusable UI elements (Disclaimer, Result Cards).
- `/lib/analysis`: The logic engine (Rule-based $\rightarrow$ Knowledge Base $\rightarrow$ AI).
- `/knowledge`: Markdown files containing the Sharia principles used for analysis.
- `/tests`: Sample documents and a validation runner.

## Privacy
RibaCheck is designed with privacy-first principles. No documents or text are stored on the server; all processing occurs in memory during the request lifecycle.
