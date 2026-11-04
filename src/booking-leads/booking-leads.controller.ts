import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingLeadsService } from './booking-leads.service';
import { CreateBookingLeadDto } from './dto/create-booking-lead.dto';

@ApiTags('booking-leads')
@Controller('booking-leads')
export class BookingLeadsController {
  constructor(private readonly bookingLeadsService: BookingLeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking assistance lead' })
  @ApiBody({ type: CreateBookingLeadDto })
  create(@Body() dto: CreateBookingLeadDto) {
    return this.bookingLeadsService.create(dto);
  }
}
