export class CreateTenantDbRequest {
  name: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  apiKey: string;
  constructor(params: {
    name: string;
    description?: string;
    tenantId: string;
    createdAt: string;
    apiKey: string;
  }) {
    this.name = params.name;
    if (params.description) {
      this.description = params.description;
    }
    this.tenantId = params.tenantId;
    this.createdAt = params.createdAt;
    this.apiKey = params.apiKey;
  }
}
