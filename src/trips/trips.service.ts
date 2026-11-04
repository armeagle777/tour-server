import { Injectable, NotFoundException } from '@nestjs/common';
import { Trip } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { VerifiedPlaceForPrompt } from '../ai/prompts/itinerary.prompt';
import { PlaceSearchTool } from '../ai/tools/place-search.tool';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    private readonly aiService: AiService,
    private readonly placeSearchTool: PlaceSearchTool,
    private readonly prisma: PrismaService,
  ) {}

  parsePrompt(prompt: string) {
    return this.aiService.parsePrompt(prompt);
  }

  async generate(input: CreateTripDto): Promise<Trip> {
    const prompt = this.buildGenerationPrompt(input);
    const parsedPrompt = await this.aiService.parsePrompt(prompt);
    const places = await this.placeSearchTool.searchForTrip(parsedPrompt);
    const verifiedPlaces: VerifiedPlaceForPrompt[] = places.map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description,
      region: place.region,
      category: place.category,
      latitude: place.latitude,
      longitude: place.longitude,
      tags: place.tags,
      seasonality: place.seasonality,
      familyFriendly: place.familyFriendly,
    }));

    const itinerary = await this.aiService.generateItinerary({
      originalPrompt: prompt,
      parsedTrip: parsedPrompt,
      places: verifiedPlaces,
    });

    return this.prisma.trip.create({
      data: {
        prompt,
        parsedPrompt,
        generatedItinerary: itinerary,
      },
    });
  }

  async findOne(id: string): Promise<Trip> {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  private buildGenerationPrompt(input: CreateTripDto): string {
    const details = [
      ['Travel dates', input.travelDates],
      ['Destination focus', input.destinationFocus],
      ['Travelers', input.travelers],
      ['Budget', input.budget],
      ['Travel style', input.travelStyle],
      ['Interests', input.interests?.join(', ')],
      ['Pace', input.pace],
      ['Constraints', input.constraints],
    ]
      .filter((detail): detail is [string, string | number] => {
        const value = detail[1];
        return typeof value === 'number' || (typeof value === 'string' && value.trim().length > 0);
      })
      .map(([label, value]) => `${label}: ${String(value).trim()}`);

    if (details.length === 0) {
      return input.prompt;
    }

    return `${input.prompt}\n\nAdditional trip details:\n${details.join('\n')}`;
  }
}
