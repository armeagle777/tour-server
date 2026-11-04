export function extractJsonObject(input: string): string {
  const fenced = input.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? input;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in AI response');
  }

  return candidate.slice(start, end + 1).trim();
}

export function parseJsonObject(input: string): unknown {
  return JSON.parse(extractJsonObject(input)) as unknown;
}
