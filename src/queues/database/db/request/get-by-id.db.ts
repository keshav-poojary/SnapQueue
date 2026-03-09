export class GetQueueByIdDbRequest {
  queueId: string;
  constructor(params: { queueId: string }) {
    this.queueId = params.queueId;
  }
}
