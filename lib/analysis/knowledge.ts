import fs from 'fs/promises';
import path from 'path';

export async function loadKnowledgeBase(documentType?: string) {
  const knowledgeDir = path.join(process.cwd(), 'knowledge');
  const files = await fs.readdir(knowledgeDir);

  let combinedKnowledge = '';

  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = await fs.readFile(path.join(knowledgeDir, file), 'utf8');
      combinedKnowledge += `\n--- ${file} ---\n${content}\n`;
    }
  }

  return combinedKnowledge;
}
