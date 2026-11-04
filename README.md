# ArmeniaGoAI Backend

Production-oriented NestJS MVP for AI-powered Armenia trip planning.

## Stack

- NestJS, TypeScript
- PostgreSQL with Prisma ORM
- OpenAI official SDK behind an `AIProvider` abstraction
- Zod validation for AI JSON responses
- class-validator and class-transformer for request validation
- Swagger/OpenAPI at `/docs`
- Structured JSON logging, helmet, CORS, global response/error envelopes

## Installation

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` and, when ready to call OpenAI, `OPENAI_API_KEY`.

## Prisma Setup

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

The seed creates verified Armenia places: Yerevan, Garni, Geghard, Dilijan, Lake Sevan, Tatev, Areni, Noravank, Gyumri, and Khor Virap.

## Run

```bash
npm run start:dev
```

Build for production:

```bash
npm run build
npm run start:prod
```

## API

All successful responses are wrapped:

```json
{
  "success": true,
  "data": {}
}
```

Errors follow:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

### Parse Prompt

```bash
curl -X POST http://localhost:3000/trip-plans/parse-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Plan a 6-day Armenia trip for two adults in September. We like wine, monasteries, nature, and a moderate pace."}'
```

### Generate Trip

```bash
curl -X POST http://localhost:3000/trip-plans/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Plan a 6-day Armenia trip for two adults in September. We like wine, monasteries, nature, and a moderate pace."}'
```

### Get Trip

```bash
curl http://localhost:3000/trip-plans/{tripId}
```

### Places

```bash
curl http://localhost:3000/places
curl "http://localhost:3000/places/search?q=wine%20monastery"
```

### Booking Lead

```bash
curl -X POST http://localhost:3000/booking-leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Ani Petrosyan","email":"ani@example.com","travelers":2,"budget":"mid-range","helpNeeded":["driver","hotels"],"message":"We need help booking the plan."}'
```

## AI Flow

1. `TripsService` asks `AiService` to parse the raw prompt.
2. `PlaceSearchTool` searches verified `Place` rows in PostgreSQL.
3. `AiService` generates an itinerary using only those verified places.
4. AI output is cleaned, parsed, and validated with strict Zod schemas.
5. Invalid AI JSON is retried once automatically.
6. The final trip is persisted in `Trip.generatedItinerary`.

Prompt files live in `src/ai/prompts`. Zod contracts live in `src/ai/schemas`.

## Adding Future AI Providers

Add a provider implementing `AIProvider` in `src/ai/providers`, then switch the binding in `src/ai/ai.module.ts`.

The current OpenAI implementation is isolated in `src/ai/providers/openai.provider.ts`, so Claude, OpenRouter, Ollama, or an internal gateway can be added without touching controllers or trip business logic.

## External API Integration Points

- Maps: add a dedicated module such as `src/maps` and call it from trip planning services or place enrichment jobs.
- Booking partners: extend `booking-leads` or add partner-specific modules behind service interfaces.
- Weather: add a `weather` module and feed summarized results into itinerary prompts.
- Payments: add a separate `payments` module with webhooks and idempotency.
- RAG/vector search: add a retrieval module and keep verified place IDs as the source of truth for itinerary grounding.

## Code Quality

```bash
npm run lint
npm run format
npm run build
```
