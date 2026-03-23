export class ServiceInvalidJobException {
  message: string;
  name: string = 'ServiceInvalidJobException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
