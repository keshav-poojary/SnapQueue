export class Tenant {
  tenantId: string;
  name: string;
  description?: string;
  createdAt: Date;
  apiKey: string;
  constructor(params: {
    tenantId: string;
    name: string;
    description?: string;
    createdAt: Date;
    apiKey: string;
  }) {
    this.tenantId = params.tenantId;
    this.name = params.name;
    if (params.description) {
      this.description = params.description;
    }
    this.createdAt = params.createdAt;
    this.apiKey = params.apiKey;
  }
}
