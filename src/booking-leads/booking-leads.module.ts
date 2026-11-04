import { Module } from '@nestjs/common';
import { BookingLeadsController } from './booking-leads.controller';
import { BookingLeadsService } from './booking-leads.service';

@Module({
  controllers: [BookingLeadsController],
  providers: [BookingLeadsService],
})
export class BookingLeadsModule {}
