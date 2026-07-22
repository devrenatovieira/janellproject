import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  controllers: [PublicController, AnalyticsController],
  providers: [PublicService],
})
export class PublicModule {}
