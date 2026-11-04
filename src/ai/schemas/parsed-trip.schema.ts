import { z } from 'zod';

export const ParsedTripSchema = z
  .object({
    travelDates: z
      .object({
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        flexible: z.boolean(),
      })
      .strict(),
    durationDays: z.number().int().positive().nullable(),
    travelers: z
      .object({
        adults: z.number().int().min(0),
        children: z.number().int().min(0),
        notes: z.string().nullable(),
      })
      .strict(),
    interests: z.array(z.string()).default([]),
    budget: z
      .object({
        level: z.enum(['low', 'mid', 'high', 'luxury', 'unknown']),
        currency: z.string().nullable(),
        amount: z.number().positive().nullable(),
      })
      .strict(),
    travelStyle: z.enum(['culture', 'nature', 'food', 'adventure', 'relaxed', 'mixed']),
    constraints: z.array(z.string()).default([]),
    pacePreference: z.enum(['slow', 'moderate', 'packed']),
    regions: z.array(z.string()).default([]),
  })
  .strict();

export type ParsedTrip = z.infer<typeof ParsedTripSchema>;
