export function buildParserPrompt(userPrompt: string): string {
  return `
Parse this Armenia travel request into strict JSON.

Return only a JSON object matching:
{
  "travelDates": { "startDate": string | null, "endDate": string | null, "flexible": boolean },
  "durationDays": number | null,
  "travelers": { "adults": number, "children": number, "notes": string | null },
  "interests": string[],
  "budget": { "level": "low" | "mid" | "high" | "luxury" | "unknown", "currency": string | null, "amount": number | null },
  "travelStyle": "culture" | "nature" | "food" | "adventure" | "relaxed" | "mixed",
  "constraints": string[],
  "pacePreference": "slow" | "moderate" | "packed",
  "regions": string[]
}

Rules:
- Use null when information is missing.
- Infer reasonable interests, style, and pace only from the prompt.
- Do not invent dates or exact budgets.
- Normalize regions and interests to concise lowercase terms where possible.

User prompt:
${userPrompt}
`.trim();
}

export const PARSER_SYSTEM_PROMPT =
  'You are a precise travel intent parser. You output valid JSON only and never include commentary.';
