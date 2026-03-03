import { Module } from '@nestjs/common';
import { QueuesController } from './controller/queue.controller';
import { QueueService } from './service/queue.service';
import { QueueRepository } from './database/queue.repository';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  imports: [TenantModule],
  controllers: [QueuesController],
  providers: [QueueService, QueueRepository],
})
export class QueueModule {}
