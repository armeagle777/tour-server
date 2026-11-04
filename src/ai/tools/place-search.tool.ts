import { Injectable } from '@nestjs/common';
import { Place } from '@prisma/client';
import { PlacesService } from '../../places/places.service';
import { ParsedTrip } from '../schemas/parsed-trip.schema';

@Injectable()
export class PlaceSearchTool {
  constructor(private readonly placesService: PlacesService) {}

  async searchForTrip(parsedTrip: ParsedTrip): Promise<Place[]> {
    const queryParts = [
      ...parsedTrip.interests,
      ...parsedTrip.regions,
      parsedTrip.travelStyle,
      ...parsedTrip.constraints,
    ].filter(Boolean);

    const results = await this.placesService.search(queryParts.join(' '));
    if (results.length > 0) {
      return results;
    }

    return this.placesService.findAll();
  }
}
