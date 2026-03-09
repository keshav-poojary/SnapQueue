export class CreateJobDbRequest {
  jobId: string;
  queueUrl: string;
  queueId: string;
  payload: Record<string, any>;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  constructor(params: {
    jobId: string;
    queueUrl: string;
    queueId: string;
    payload: Record<string, any>;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
  }) {
    this.jobId = params.jobId;
    this.queueUrl = params.queueUrl;
    this.queueId = params.queueId;
    this.payload = params.payload;
    this.tenantId = params.tenantId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
