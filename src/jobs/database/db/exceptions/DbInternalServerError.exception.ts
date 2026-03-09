export class DbInternalServerException {
  message: string;
  name: string = 'DbInternalServerException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
