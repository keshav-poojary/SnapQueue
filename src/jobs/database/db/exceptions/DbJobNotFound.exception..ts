export class DbJobNotFoundException {
  message: string;
  name: string = 'DbJobNotFoundException';
  context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown>) {
    this.message = message;
    this.context = context;
  }
}
