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
    pattern: /\b(interest rate|annual percentage rate|apr|fixed rate|floating rate|interest accrues|interest is capitalized)\b/gi,
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
    pattern: /\b(late payment fee|penalty fee|overdue charge|pay back \$\d+ in \d+ days)\b/gi,
    category: 'riba',
    severity: 'medium',
    why: 'Late fees or fixed increases on loan repayments are often viewed as riba.',
  },
  {
    pattern: /\b(guaranteed returns|fixed profit|assured profit|service charge of \d+% per month)\b/gi,
    category: 'riba',
    severity: 'high',
    why: 'Guaranteeing a fixed return or adding a percentage service charge to a loan is a form of riba.',
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
    why: 'Flat processing fees are generally allowed if they represent actual administrative costs.',
  },
  {
    pattern: /\b(insurance policy|premium|coverage)\b/gi,
    category: 'gharar',
    severity: 'low',
    why: 'Conventional insurance often involves gharar (uncertainty) regarding the payout.',
  },
  {
    pattern: /\b(chit fund|pool \$\d+|winner takes)\b/gi,
    category: 'maysir',
    severity: 'medium',
    why: 'Chit funds where winners are picked by chance or interest is split may involve maysir or riba.',
  },
  {
    pattern: /\b(guaranteed at the end of)\b/gi,
    category: 'gharar',
    severity: 'medium',
    why: 'Guaranteed futures in informal funds can contain gharar if the delivery is uncertain.',
  },
];

export function runRuleBasedChecks(text: string): RuleFlag[] {
  const flags: RuleFlag[] = [];

  for (const rule of RULES) {
    let match;
    rule.pattern.lastIndex = 0;

    while ((match = rule.pattern.exec(text)) !== null) {
      const start = Math.max(0, match.index - 40);
      const end = Math.min(text.length, match.index + match[0].length + 40);
      const quote = text.substring(start, end).replace(/\n/g, ' ').trim();

      flags.push({
        quote: `...${quote}...`,
        category: rule.category,
        severity: rule.severity,
        why: rule.why,
      });

      if (match.index === rule.pattern.lastIndex) {
        rule.pattern.lastIndex++;
      }
    }
  }

  return flags;
}
