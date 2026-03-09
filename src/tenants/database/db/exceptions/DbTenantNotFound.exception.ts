export class DbTenantNotFoundException {
  message: string;
  name: string = 'DbTenantNotFoundException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
