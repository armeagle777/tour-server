import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

type LogPayload = string | Record<string, unknown>;

@Injectable()
export class StructuredLogger extends ConsoleLogger {
  protected printMessages(
    messages: unknown[],
    context = '',
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr',
  ): void {
    const stream = writeStreamType === 'stderr' ? process.stderr : process.stdout;
    for (const message of messages) {
      stream.write(
        `${JSON.stringify({
          level: logLevel,
          timestamp: new Date().toISOString(),
          context,
          ...(typeof message === 'object' && message !== null ? message : { message }),
        })}\n`,
      );
    }
  }

  log(message: LogPayload, context?: string): void {
    super.log(message, context);
  }

  warn(message: LogPayload, context?: string): void {
    super.warn(message, context);
  }
}
