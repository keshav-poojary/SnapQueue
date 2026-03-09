export class ServiceQueueNotFoundException {
  message: string;
  name: string = 'ServiceQueueNotFoundException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
