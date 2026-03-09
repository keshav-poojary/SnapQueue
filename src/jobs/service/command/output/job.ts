import { JobStatusEnum } from 'src/jobs/constants/enum';

export class Job {
  jobId: string;
  queueId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, any>;
  jobStatus: JobStatusEnum;
  attempts: number;
  constructor(params: {
    jobId: string;
    queueId: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    payload: Record<string, any>;
    jobStatus: JobStatusEnum;
    attempts: number;
  }) {
    this.jobId = params.jobId;
    this.queueId = params.queueId;
    this.tenantId = params.tenantId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.payload = params.payload;
    this.jobStatus = params.jobStatus;
    this.attempts = params.attempts;
  }
}
