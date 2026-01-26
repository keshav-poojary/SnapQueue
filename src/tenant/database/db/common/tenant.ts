export class TenantDb {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  apiKey: string;
  constructor(params: {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    apiKey: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    if (params.description) {
      this.description = params.description;
    }
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.createdBy = params.createdBy;
    this.updatedBy = params.updatedBy;
    this.apiKey = params.apiKey;
  }
}
