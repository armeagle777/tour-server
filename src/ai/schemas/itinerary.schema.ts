import { z } from 'zod';

export const ItineraryPlaceSchema = z
  .object({
    placeId: z.string().uuid(),
    name: z.string(),
    region: z.string(),
    reason: z.string(),
  })
  .strict();

export const ItineraryActivitySchema = z
  .object({
    timeOfDay: z.enum(['morning', 'afternoon', 'evening']),
    title: z.string(),
    description: z.string(),
    place: ItineraryPlaceSchema,
    estimatedDurationHours: z.number().positive(),
    travelNotes: z.string().nullable(),
  })
  .strict();

export const ItineraryDaySchema = z
  .object({
    day: z.number().int().positive(),
    title: z.string(),
    regionFocus: z.string(),
    activities: z.array(ItineraryActivitySchema).min(1),
    pacingNotes: z.string(),
  })
  .strict();

export const ItinerarySchema = z
  .object({
    summary: z.string(),
    durationDays: z.number().int().positive(),
    recommendedSeason: z.string().nullable(),
    days: z.array(ItineraryDaySchema).min(1),
    practicalNotes: z.array(z.string()),
    verifiedPlaceIds: z.array(z.string().uuid()),
  })
  .strict();

export type Itinerary = z.infer<typeof ItinerarySchema>;
