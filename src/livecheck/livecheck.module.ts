import { Module } from '@nestjs/common';
import { LiveCheckController } from './controller/livecheck.controller';

@Module({
  controllers: [LiveCheckController],
  providers: [],
})
export class LiveCheckModule {}
