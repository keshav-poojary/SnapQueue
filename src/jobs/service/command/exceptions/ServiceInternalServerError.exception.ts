export class ServiceInternalServerException {
  message: string;
  name: string = 'ServiceInternalServerException';
  context: Record<string, unknown> | unknown;

  constructor(message: string, context: Record<string, unknown> | unknown) {
    this.message = message;
    this.context = context;
  }
}
