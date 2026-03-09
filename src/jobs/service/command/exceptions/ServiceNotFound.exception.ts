export class ServiceJobNotFoundException {
  message: string;
  name: string = 'ServiceJobNotFoundException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
