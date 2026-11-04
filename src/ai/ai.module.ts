import { Module } from '@nestjs/common';
import { PlacesModule } from '../places/places.module';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './providers/ai-provider.interface';
import { OpenAIProvider } from './providers/openai.provider';
import { PlaceSearchTool } from './tools/place-search.tool';

@Module({
  imports: [PlacesModule],
  providers: [
    AiService,
    PlaceSearchTool,
    {
      provide: AI_PROVIDER,
      useClass: OpenAIProvider,
    },
  ],
  exports: [AiService, PlaceSearchTool],
})
export class AiModule {}
