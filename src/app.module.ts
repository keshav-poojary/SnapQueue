import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TenantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
