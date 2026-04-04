import { Module } from '@nestjs/common';
import { JobController } from './controller/job.controller';
import { JobService } from './service/job.service';
import { JobRepository } from './database/job.repository';

import { JobProcessorService } from './service/job.processor.service';
import { EmailService } from './service/tasks/email.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageProcessorService } from './service/tasks/image.processor..service';
import { BulkEmailService } from './service/tasks/bulk.email.service';
import { QueueRepository } from '../queues/database/queue.repository';
import { TenantModule } from '../tenants/tenant.module';
import { WorkerService } from './service/worker.service';

@Module({
  imports: [TenantModule, ScheduleModule.forRoot()],
  controllers: [JobController],
  providers: [
    JobService,
    JobRepository,
    QueueRepository,
    JobService,
    WorkerService,
    JobProcessorService,
    EmailService,
    ImageProcessorService,
    BulkEmailService,
  ],
})
export class JobModule {}
