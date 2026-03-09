import { Module } from '@nestjs/common';
import { JobController } from './controller/job.controller';
import { JobService } from './service/job.service';
import { JobRepository } from './database/job.repository';
import { QueueRepository } from 'src/queues/database/queue.repository';
import { TenantModule } from 'src/tenants/tenant.module';

@Module({
  imports: [TenantModule],
  controllers: [JobController],
  providers: [JobService, JobRepository, QueueRepository],
})
export class JobModule {}
