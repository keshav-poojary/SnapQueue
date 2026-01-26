import { Module } from '@nestjs/common';
import { TenantController } from './controller/tenant.controller';
import { TenantService } from './service/tenant.service';
import { TenantRepository } from './database/tenant.repository';

@Module({
  imports: [],
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
})
export class TenantModule {}
