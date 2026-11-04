import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const places = [
  {
    name: 'Yerevan',
    slug: 'yerevan',
    description:
      'Armenia capital with museums, cafes, Cascade, Republic Square, and strong food culture.',
    region: 'Yerevan',
    category: 'city',
    latitude: 40.1872,
    longitude: 44.5152,
    tags: ['culture', 'food', 'history', 'museums', 'nightlife'],
    seasonality: ['spring', 'summer', 'autumn', 'winter'],
    familyFriendly: true,
  },
  {
    name: 'Garni',
    slug: 'garni',
    description: 'Village known for the Garni Temple and nearby basalt Symphony of Stones gorge.',
    region: 'Kotayk',
    category: 'heritage',
    latitude: 40.1124,
    longitude: 44.7306,
    tags: ['temple', 'history', 'nature', 'photography'],
    seasonality: ['spring', 'summer', 'autumn'],
    familyFriendly: true,
  },
  {
    name: 'Geghard',
    slug: 'geghard',
    description: 'UNESCO-listed medieval monastery partly carved into cliffs near the Azat Valley.',
    region: 'Kotayk',
    category: 'monastery',
    latitude: 40.1405,
    longitude: 44.8186,
    tags: ['monastery', 'unesco', 'history', 'culture'],
    seasonality: ['spring', 'summer', 'autumn', 'winter'],
    familyFriendly: true,
  },
  {
    name: 'Dilijan',
    slug: 'dilijan',
    description:
      'Forested resort town with hiking access, old town streets, and nearby monasteries.',
    region: 'Tavush',
    category: 'nature',
    latitude: 40.7408,
    longitude: 44.8631,
    tags: ['nature', 'hiking', 'forest', 'relaxation'],
    seasonality: ['spring', 'summer', 'autumn'],
    familyFriendly: true,
  },
  {
    name: 'Lake Sevan',
    slug: 'lake-sevan',
    description:
      'High-altitude freshwater lake with beaches, viewpoints, fish restaurants, and Sevanavank.',
    region: 'Gegharkunik',
    category: 'lake',
    latitude: 40.3942,
    longitude: 45.353,
    tags: ['lake', 'nature', 'food', 'swimming', 'views'],
    seasonality: ['summer', 'autumn'],
    familyFriendly: true,
  },
  {
    name: 'Tatev',
    slug: 'tatev',
    description:
      'Historic monastery reached by the Wings of Tatev aerial tramway over dramatic canyons.',
    region: 'Syunik',
    category: 'monastery',
    latitude: 39.3793,
    longitude: 46.2486,
    tags: ['monastery', 'canyon', 'tramway', 'history', 'views'],
    seasonality: ['spring', 'summer', 'autumn'],
    familyFriendly: true,
  },
  {
    name: 'Areni',
    slug: 'areni',
    description:
      'Wine village in Vayots Dzor known for wineries, caves, and access to canyon landscapes.',
    region: 'Vayots Dzor',
    category: 'wine',
    latitude: 39.7196,
    longitude: 45.1838,
    tags: ['wine', 'food', 'caves', 'culture'],
    seasonality: ['spring', 'summer', 'autumn'],
    familyFriendly: false,
  },
  {
    name: 'Noravank',
    slug: 'noravank',
    description: 'Red-rock canyon monastery complex with some of Armenia most striking scenery.',
    region: 'Vayots Dzor',
    category: 'monastery',
    latitude: 39.6847,
    longitude: 45.2329,
    tags: ['monastery', 'canyon', 'photography', 'history'],
    seasonality: ['spring', 'summer', 'autumn'],
    familyFriendly: true,
  },
  {
    name: 'Gyumri',
    slug: 'gyumri',
    description:
      'Armenia second city with black tuff architecture, museums, humor, and craft traditions.',
    region: 'Shirak',
    category: 'city',
    latitude: 40.7894,
    longitude: 43.8475,
    tags: ['culture', 'architecture', 'food', 'museums'],
    seasonality: ['spring', 'summer', 'autumn', 'winter'],
    familyFriendly: true,
  },
  {
    name: 'Khor Virap',
    slug: 'khor-virap',
    description: 'Monastery near the Turkish border with iconic Mount Ararat views on clear days.',
    region: 'Ararat',
    category: 'monastery',
    latitude: 39.8786,
    longitude: 44.5766,
    tags: ['monastery', 'ararat', 'history', 'photography'],
    seasonality: ['spring', 'summer', 'autumn', 'winter'],
    familyFriendly: true,
  },
];

async function main(): Promise<void> {
  for (const place of places) {
    await prisma.place.upsert({
      where: { slug: place.slug },
      update: place,
      create: place,
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
