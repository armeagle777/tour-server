import { ApiProperty } from '@nestjs/swagger';

export class TripEntity {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  prompt!: string;

  @ApiProperty()
  parsedPrompt!: unknown;

  @ApiProperty()
  generatedItinerary!: unknown;

  @ApiProperty()
  createdAt!: Date;
}
