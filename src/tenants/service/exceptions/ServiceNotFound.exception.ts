export class ServiceTenantNotFoundException {
  message: string;
  name: string = 'ServiceTenantNotFoundException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
