import { Injectable } from '@nestjs/common';
import { TenantRepository } from '../database/tenant.repository';
import { v4 as uuid } from 'uuid';
import {
  CreateTenantCommandInput,
  GetTenantByIdCommandInput,
  GetTenantByIdCommandOutput,
  GetTenantsCommandInput,
  GetTenantsCommandOutput,
} from './command';
import { CreateTenantDbRequest } from '../database/db/request/create';
import { DbTenantNotFoundException } from '../database/db/exceptions/DbTenantNotFound.exception';
import { ServiceTenantNotFoundException } from './exceptions/ServiceNotFound.exception';
import { ServiceInternalServerException } from './exceptions/ServiceInternalServerError.exception';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  private generateApiKey() {
    return `api_key-${uuid()}`;
  }
  async create(command: CreateTenantCommandInput) {
    try {
      console.log('Creating tenant with command:', command)
      const tenantId = uuid();
      const apiKey = this.generateApiKey();

      const dbRequest: CreateTenantDbRequest = {
        tenantId,
        apiKey,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'xyz',
        updatedBy: 'xyz',
        ...command,
      };

      await this.tenantRepository.create(dbRequest);

      const result = await this.tenantRepository.getById({ id: tenantId });

      return new GetTenantByIdCommandOutput({
        ...result,
      });
    } catch (error) {
      if (error instanceof DbTenantNotFoundException) {
        throw new ServiceTenantNotFoundException('Tenant Not found', {
          context: error,
        });
      }
      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }

  async getById(command: GetTenantByIdCommandInput) {
    try {
      const result = await this.tenantRepository.getById({ id: command.id });

      return new GetTenantByIdCommandOutput({
        ...result,
      });
    } catch (error) {
      if (error instanceof DbTenantNotFoundException) {
        throw new ServiceTenantNotFoundException('Tenant Not found', {
          context: error,
        });
      }
      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }

  async getAll(command: GetTenantsCommandInput) {
    try {
      const result = await this.tenantRepository.query({
        limit: command.limit,
        offset: command.offset,
      });

      return new GetTenantsCommandOutput({
        tenants: result.tenants,
        offset: result.offset,
      });
    } catch (error) {
      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }
}
