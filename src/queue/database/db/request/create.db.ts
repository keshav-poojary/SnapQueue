export class CreateQueueDbRequest {
  tenantId: string;
  name: string;
  queueId: string;
  queueName: string;
  retryLimit?: number = 3;
  retryDelay?: number = 5000;
  createdAt: string;
  constructor(params: {
    tenantId: string;
    name: string;
    retryLimit?: number;
    retryDelay?: number;
    queueId: string;
    queueName: string;
    createdAt: string;
  }) {
    this.tenantId = params.tenantId;
    this.name = params.name;
    this.queueId = params.queueId;
    this.createdAt = params.createdAt;
    this.queueName = params.queueName;
    if (params.retryLimit !== undefined) {
      this.retryLimit = params.retryLimit;
    }
    if (params.retryDelay !== undefined) {
      this.retryDelay = params.retryDelay;
    }
  }
}
