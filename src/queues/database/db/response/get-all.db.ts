import { QueueDb } from '../common/queue.db';

export class GetAllQueuesDbResponse {
  queues: Array<QueueDb>;
  offset?: string;
  constructor(params: { queues: Array<QueueDb>; offset?: string }) {
    this.queues = params.queues;
    this.offset = params.offset;
  }
}
