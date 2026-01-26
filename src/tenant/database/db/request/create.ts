export class CreateTenantDbRequest {
  name: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  apiKey: string;
  constructor(params: {
    name: string;
    description?: string;
    tenantId: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    apiKey: string;
  }) {
    this.name = params.name;
    if (params.description) {
      this.description = params.description;
    }
    this.tenantId = params.tenantId;
    this.createdBy = params.createdBy;
    this.updatedBy = params.updatedBy;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.apiKey = params.apiKey;
  }
}
