import { Injectable } from '@nestjs/common';
import { Prisma, Place } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlacesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Place[]> {
    return this.prisma.place.findMany({
      orderBy: [{ region: 'asc' }, { name: 'asc' }],
    });
  }

  search(query: string): Promise<Place[]> {
    const tokens = this.tokenize(query);
    if (tokens.length === 0) {
      return this.findAll();
    }

    const containsFilters = tokens.flatMap<Prisma.PlaceWhereInput>((token) => [
      { name: { contains: token, mode: 'insensitive' } },
      { description: { contains: token, mode: 'insensitive' } },
      { region: { contains: token, mode: 'insensitive' } },
      { category: { contains: token, mode: 'insensitive' } },
    ]);

    return this.prisma.place.findMany({
      where: {
        OR: [
          ...containsFilters,
          { tags: { hasSome: tokens } },
          { seasonality: { hasSome: tokens } },
        ],
      },
      orderBy: [{ region: 'asc' }, { name: 'asc' }],
      take: 20,
    });
  }

  private tokenize(query: string): string[] {
    return Array.from(
      new Set(
        query
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .map((token) => token.trim())
          .filter((token) => token.length >= 2),
      ),
    );
  }
}
