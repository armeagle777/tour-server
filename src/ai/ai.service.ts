import { Inject, Injectable } from '@nestjs/common';
import { AiResponseException } from '../common/exceptions/ai-response.exception';
import { parseJsonObject } from '../common/utils/json-extraction.util';
import {
  buildItineraryPrompt,
  ITINERARY_SYSTEM_PROMPT,
  VerifiedPlaceForPrompt,
} from './prompts/itinerary.prompt';
import { buildParserPrompt, PARSER_SYSTEM_PROMPT } from './prompts/parser.prompt';
import { AI_PROVIDER, AIProvider } from './providers/ai-provider.interface';
import { Itinerary, ItinerarySchema } from './schemas/itinerary.schema';
import { ParsedTrip, ParsedTripSchema } from './schemas/parsed-trip.schema';

@Injectable()
export class AiService {
  constructor(@Inject(AI_PROVIDER) private readonly provider: AIProvider) {}

  async parsePrompt(prompt: string): Promise<ParsedTrip> {
    return this.generateValidated({
      system: PARSER_SYSTEM_PROMPT,
      user: buildParserPrompt(prompt),
      validate: (value) => ParsedTripSchema.parse(value),
    });
  }

  async generateItinerary(input: {
    originalPrompt: string;
    parsedTrip: ParsedTrip;
    places: VerifiedPlaceForPrompt[];
  }): Promise<Itinerary> {
    const itinerary = await this.generateValidated({
      system: ITINERARY_SYSTEM_PROMPT,
      user: buildItineraryPrompt(input),
      validate: (value) => ItinerarySchema.parse(value),
    });

    const verifiedIds = new Set(input.places.map((place) => place.id));
    const usedIds = itinerary.verifiedPlaceIds;
    const invalidIds = usedIds.filter((id) => !verifiedIds.has(id));
    if (invalidIds.length > 0) {
      throw new AiResponseException('AI itinerary referenced unverified places');
    }

    return itinerary;
  }

  private async generateValidated<T>(input: {
    system: string;
    user: string;
    validate: (value: unknown) => T;
  }): Promise<T> {
    let lastError: unknown;

    for (const attempt of [1, 2]) {
      try {
        const response = await this.provider.generateText({
          system: input.system,
          user:
            attempt === 1
              ? input.user
              : `${input.user}\n\nPrevious output was invalid. Return corrected strict JSON only.`,
          temperature: 0.2,
        });
        return input.validate(parseJsonObject(response));
      } catch (error) {
        lastError = error;
      }
    }

    throw new AiResponseException(
      lastError instanceof Error ? lastError.message : 'AI response validation failed',
    );
  }
}
