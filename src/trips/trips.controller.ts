import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripEntity } from './entities/trip.entity';
import { TripsService } from './trips.service';

@ApiTags('trip-plans')
@Controller('trip-plans')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('parse-prompt')
  @ApiOperation({ summary: 'Parse a free-form trip prompt into structured travel data' })
  @ApiBody({ type: CreateTripDto })
  parsePrompt(@Body() dto: CreateTripDto) {
    return this.tripsService.parsePrompt(dto.prompt);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate and persist a verified-place Armenia itinerary' })
  @ApiBody({ type: CreateTripDto })
  @ApiOkResponse({ type: TripEntity })
  generate(@Body() dto: CreateTripDto) {
    return this.tripsService.generate(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a saved trip plan by id' })
  @ApiOkResponse({ type: TripEntity })
  @ApiNotFoundResponse({ description: 'Trip not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tripsService.findOne(id);
  }
}
