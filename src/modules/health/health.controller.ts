import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service';

@Controller('healthz')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  getHealth(): string {
    return this.healthService.getHealth();
  }
}
