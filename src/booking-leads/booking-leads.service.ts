import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingLead } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingLeadDto } from './dto/create-booking-lead.dto';

@Injectable()
export class BookingLeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingLeadDto): Promise<BookingLead> {
    if (dto.tripId) {
      const tripExists = await this.prisma.trip.findUnique({
        where: { id: dto.tripId },
        select: { id: true },
      });

      if (!tripExists) {
        throw new BadRequestException('tripId does not reference an existing trip');
      }
    }

    return this.prisma.bookingLead.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        telegramOrWhatsapp: dto.telegramOrWhatsapp,
        travelers: dto.travelers,
        budget: dto.budget,
        message: dto.message,
        helpNeeded: dto.helpNeeded,
        tripId: dto.tripId,
      },
    });
  }
}
