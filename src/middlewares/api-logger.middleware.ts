import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiLoggerMiddleware implements NestMiddleware {
  constructor() {}
  use(req: any, res: any, next: (error?: any) => void) {}
}
