export class CreateTenantCommandInput {
  name: string;
  description?: string;
  constructor(params: { name: string; description?: string }) {
    this.name = params.name;
    if (params.description) {
      this.description = params.description;
    }
  }
}
