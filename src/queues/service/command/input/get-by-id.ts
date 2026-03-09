export class GetQueueByIdCommandInput {
  queueId: string;
  constructor(params: { queueId: string }) {
    this.queueId = params.queueId;
  }
}
