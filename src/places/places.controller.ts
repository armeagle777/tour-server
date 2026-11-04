import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @ApiOperation({ summary: 'List verified Armenia places' })
  findAll() {
    return this.placesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search verified Armenia places' })
  @ApiQuery({ name: 'q', example: 'wine monasteries nature', required: true })
  search(@Query('q') query: string) {
    return this.placesService.search(query);
  }
}
