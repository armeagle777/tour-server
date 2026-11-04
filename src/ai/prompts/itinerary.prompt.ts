import { ParsedTrip } from '../schemas/parsed-trip.schema';

export interface VerifiedPlaceForPrompt {
  id: string;
  name: string;
  description: string;
  region: string;
  category: string;
  latitude: number;
  longitude: number;
  tags: string[];
  seasonality: string[];
  familyFriendly: boolean;
}

export function buildItineraryPrompt(input: {
  originalPrompt: string;
  parsedTrip: ParsedTrip;
  places: VerifiedPlaceForPrompt[];
}): string {
  return `
Generate an Armenia itinerary as strict JSON.

Original user request:
${input.originalPrompt}

Parsed travel data:
${JSON.stringify(input.parsedTrip, null, 2)}

Verified places you may use:
${JSON.stringify(input.places, null, 2)}

Output schema:
{
  "summary": string,
  "durationDays": number,
  "recommendedSeason": string | null,
  "days": [
    {
      "day": number,
      "title": string,
      "regionFocus": string,
      "activities": [
        {
          "timeOfDay": "morning" | "afternoon" | "evening",
          "title": string,
          "description": string,
          "place": { "placeId": uuid, "name": string, "region": string, "reason": string },
          "estimatedDurationHours": number,
          "travelNotes": string | null
        }
      ],
      "pacingNotes": string
    }
  ],
  "practicalNotes": string[],
  "verifiedPlaceIds": uuid[]
}

Rules:
- Use only places from the verified places list. Never invent places, hotels, restaurants, or attractions.
- Every place.placeId must exactly match a verified place id.
- Keep travel pacing realistic for Armenia road distances.
- Avoid impossible schedules and excessive same-day cross-country jumps.
- Prefer fewer, higher-quality activities for slow or moderate pace.
- Generate JSON only. No markdown, no explanation.
`.trim();
}

export const ITINERARY_SYSTEM_PROMPT =
  'You are an Armenia travel planner that only uses verified database places and returns valid JSON.';
