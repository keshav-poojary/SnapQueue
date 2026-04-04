import { JobStatusEnum } from '../../../constants/enum';

export class JobDb {
  jobId: string;
  queueId: string;
  queueUrl: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, any>;
  jobStatus: JobStatusEnum;
  attempts: number;
  constructor(params: {
    jobId: string;
    queueId: string;
    queueUrl: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    payload: Record<string, any>;
    jobStatus: JobStatusEnum;
    attempts: number;
  }) {
    this.jobId = params.jobId;
    this.queueId = params.queueId;
    this.queueUrl = params.queueUrl;
    this.tenantId = params.tenantId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.payload = params.payload;
    this.jobStatus = params.jobStatus;
    this.attempts = params.attempts;
  }
}
