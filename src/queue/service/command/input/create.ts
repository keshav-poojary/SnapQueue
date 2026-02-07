export class CreateQueueCommandInput {
  tenantId: string;
  name: string;
  retryLimit?: number = 3;
  retryDelay?: number = 5000;
  constructor(params: {
    tenantId: string;
    name: string;
    retryLimit?: number;
    retryDelay?: number;
  }) {
    this.tenantId = params.tenantId;
    this.name = params.name;
    if (params.retryLimit !== undefined) {
      this.retryLimit = params.retryLimit;
    }
    if (params.retryDelay !== undefined) {
      this.retryDelay = params.retryDelay;
    }
  }
}
