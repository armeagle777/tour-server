import { BadGatewayException } from '@nestjs/common';

export class AiResponseException extends BadGatewayException {
  constructor(message = 'AI provider returned an invalid response') {
    super(message);
  }
}
