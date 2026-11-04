export interface AppConfig {
  port: number;
  databaseUrl: string;
  openai: {
    apiKey: string;
    model: string;
  };
}

export default (): AppConfig => ({
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
    model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
  },
});
