export interface RuleFlag {
  quote: string;
  category: 'riba' | 'gharar' | 'maysir' | 'other';
  severity: 'low' | 'medium' | 'high';
  why: string;
}

interface AnalysisRule {
  pattern: RegExp;
  category: RuleFlag['category'];
  severity: RuleFlag['severity'];
  why: string;
}

const RULES: AnalysisRule[] = [
  {
    pattern: /\b(interest rate|annual percentage rate|apr|fixed rate|floating rate)\b/gi,
    category: 'riba',
    severity: 'high',
    why: 'Mention of interest rates is a strong indicator of riba al-nasia (time-based interest).',
  },
  {
    pattern: /\b(compounded monthly|compounded daily|compounding interest)\b/gi,
    category: 'riba',
    severity: 'high',
    why: 'Compounding interest is a classic form of riba where interest is charged on previously accrued interest.',
  },
  {
    pattern: /\b(late payment fee|penalty fee|overdue charge)\b/gi,
    category: 'riba',
    severity: 'medium',
    why: 'Late fees that increase the total debt are often viewed as riba, though scholars differ on flat service fees.',
  },
  {
    pattern: /\b(guaranteed returns|fixed profit|assured profit)\b/gi,
    category: 'riba',
    severity: 'high',
    why: 'Guaranteeing a fixed return on an investment/loan often transforms it into a riba-based loan.',
  },
  {
    pattern: /\b(variable rate|market-linked rate)\b/gi,
    category: 'riba',
    severity: 'medium',
    why: 'Variable rates in loans usually refer to fluctuating interest rates.',
  },
  {
    pattern: /\b(processing fee|admin fee|origination fee)\b/gi,
    category: 'other',
    severity: 'low',
    why: 'Flat processing fees are generally allowed if they represent actual administrative costs and not a hidden interest rate.',
  },
  {
    pattern: /\b(insurance policy|premium|coverage)\b/gi,
    category: 'gharar',
    severity: 'low',
    why: 'Conventional insurance often involves gharar (uncertainty) regarding the payout and the exchange of money for a promise.',
  },
];

export function runRuleBasedChecks(text: string): RuleFlag[] {
  const flags: RuleFlag[] = [];

  for (const rule of RULES) {
    let match;
    // Reset regex index for global searches
    rule.pattern.lastIndex = 0;

    while ((match = rule.pattern.exec(text)) !== null) {
      // Extract a small window around the match for the quote
      const start = Math.max(0, match.index - 40);
      const end = Math.min(text.length, match.index + match[0].length + 40);
      const quote = text.substring(start, end).replace(/\n/g, ' ').trim();

      flags.push({
        quote: `...${quote}...`,
        category: rule.category,
        severity: rule.severity,
        why: rule.why,
      });

      // Prevent infinite loops if regex doesn't advance
      if (match.index === rule.pattern.lastIndex) {
        rule.pattern.lastIndex++;
      }
    }
  }

  return flags;
}
