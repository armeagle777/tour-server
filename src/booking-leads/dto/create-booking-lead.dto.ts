import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookingLeadDto {
  @ApiProperty({ example: 'Ani Petrosyan' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'ani@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '+37499123456' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @ApiPropertyOptional({ example: '@ani_travels' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  telegramOrWhatsapp?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  travelers?: number;

  @ApiPropertyOptional({ example: 'mid-range, up to $2500' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  budget?: string;

  @ApiPropertyOptional({ example: 'We need a driver and boutique hotel suggestions.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @ApiProperty({ example: ['driver', 'hotels', 'guide'], type: [String] })
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  helpNeeded!: string[];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  tripId?: string;
}
