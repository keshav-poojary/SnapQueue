export class CreateJobCommandInput {
  queueId: string;
  payload: Record<string, any>;
  tenantId: string;
  constructor(params: {
    queueId: string;
    payload: Record<string, any>;
    tenantId: string;
  }) {
    this.queueId = params.queueId;
    this.payload = params.payload;
    this.tenantId = params.tenantId;
  }
}
