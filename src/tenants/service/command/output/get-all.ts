import { Tenant } from '../common/tenant';

export class GetTenantsCommandOutput {
  tenants: Array<Tenant>;
  offset?: string;
  constructor(params: { tenants: Array<Tenant>; offset?: string }) {
    this.tenants = params.tenants;
    if (params.offset) {
      this.offset = params.offset;
    }
  }
}
