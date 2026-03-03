import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenant/tenant.module';
import { QueueModule } from './queue/queue.module';
import { LiveCheckModule } from './livecheck/livecheck.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LiveCheckModule,
    TenantModule,
    QueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
