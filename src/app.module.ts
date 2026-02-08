import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenant/tenant.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TenantModule, QueueModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
