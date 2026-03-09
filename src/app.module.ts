import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenants/tenant.module';
import { QueueModule } from './queues/queue.module';
import { LiveCheckModule } from './livecheck/livecheck.module';
import { JobModule } from './jobs/job.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LiveCheckModule,
    TenantModule,
    QueueModule,
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
