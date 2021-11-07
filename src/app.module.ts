import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, AuthModule],
})
export class AppModule {}
