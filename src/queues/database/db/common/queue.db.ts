export class QueueDb {
  tenantId: string;
  name: string;
  queueId?: string;
  queueUrl?: string;
  queueArn?: string;
  retryLimit?: number = 3;
  retryDelay?: number = 5000;
  createdAt: string;

  constructor(params: {
    tenantId: string;
    name: string;
    queueId?: string;
    queueUrl?: string;
    queueArn?: string;
    retryLimit?: number;
    retryDelay?: number;
    createdAt: string;
  }) {
    this.tenantId = params.tenantId;
    this.name = params.name;
    if (params.queueId) {
      this.queueId = params.queueId;
    }
    if (params.queueUrl) {
      this.queueUrl = params.queueUrl;
    }
    if (params.queueArn) {
      this.queueArn = params.queueArn;
    }
    if (params.retryLimit !== undefined) {
      this.retryLimit = params.retryLimit;
    }
    if (params.retryDelay !== undefined) {
      this.retryDelay = params.retryDelay;
    }
    this.createdAt = params.createdAt;
  }
}
