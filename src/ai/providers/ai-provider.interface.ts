export const AI_PROVIDER = Symbol('AI_PROVIDER');

export interface AiProviderRequest {
  system: string;
  user: string;
  temperature?: number;
}

export interface AIProvider {
  generateText(request: AiProviderRequest): Promise<string>;
}
