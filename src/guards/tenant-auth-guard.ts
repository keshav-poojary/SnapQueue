import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthError } from './exceptions/AuthError.exeception';
import { TenantService } from '../tenants/service/tenant.service';
@Injectable()
export class TenantAuthGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new AuthError('API key is missing in Header', {
        header: request.headers['x-api-key'],
      });
    }

    const tenant = await this.tenantService.getTenantByApiKey(apiKey);
    const method = request.method;

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (request.body?.tenantId && request.body.tenantId !== tenant.tenantId) {
        throw new AuthError('Tenant ID in body does not match with API key', {
          apiKey,
          tenantId: request.body.tenantId,
        });
      }
    }

    return true;
  }
}
