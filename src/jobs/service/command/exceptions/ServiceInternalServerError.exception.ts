export class ServiceInternalServerException {
  message: string;
  name: string = 'ServiceInternalServerException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
