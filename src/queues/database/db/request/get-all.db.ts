export class GetAllQueuesDbRequest {
  limit?: number;
  offset?: string;
  constructor(params: { limit?: number; offset?: string }) {
    this.limit = params.limit;
    this.offset = params.offset;
  }
}
