import { TenantDb } from '../common/tenant';

export class GetTenantsDbResponse {
  tenants: Array<TenantDb>;
  offset?: string;
  constructor(params: { tenants: Array<TenantDb>; offset?: string }) {
    this.tenants = params.tenants;
    if (params.offset) {
      this.offset = params.offset;
    }
  }
}
