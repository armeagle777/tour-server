import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTripDto {
  @ApiProperty({
    example:
      'Plan a 6-day Armenia trip for two adults in September. We like wine, monasteries, nature, and a moderate pace.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(4000)
  prompt!: string;

  @ApiProperty({ required: false, example: 'June 10-15 or early autumn' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  travelDates?: string;

  @ApiProperty({ required: false, example: 'Yerevan, Dilijan, and wine country' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  destinationFocus?: string;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  travelers?: number;

  @ApiProperty({ required: false, example: 'Mid-range' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  budget?: string;

  @ApiProperty({ required: false, example: 'Culture and food' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  travelStyle?: string;

  @ApiProperty({ required: false, example: ['Culture', 'Food', 'Wine'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  interests?: string[];

  @ApiProperty({ required: false, example: 'Balanced' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  pace?: string;

  @ApiProperty({ required: false, example: 'No long drives, family-friendly stops' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  constraints?: string;
}
