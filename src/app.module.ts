import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { AiModule } from './ai/ai.module';
import { BookingLeadsModule } from './booking-leads/booking-leads.module';
import { StructuredLogger } from './common/logger/structured-logger.service';
import { PlacesModule } from './places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    AiModule,
    PlacesModule,
    TripsModule,
    BookingLeadsModule,
  ],
  providers: [StructuredLogger],
})
export class AppModule {}
