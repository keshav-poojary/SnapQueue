import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TenantService } from 'src/tenant/service/tenant.service';
import { AuthError } from './exceptions/AuthError.exeception';
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

    if (request.body.tenantId && request.body.tenantId !== tenant.tenantId) {
      throw new AuthError('Tenant ID in body does not match with API key', {
        apiKey: request.headers['x-api-key'],
        tenantId: request.body.tenantId,
      });
    }

    return true;
  }
}
