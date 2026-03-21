import { JobResultDb } from './job.result.db';

export class GetJobResultDbResponse {
  jobResult?: JobResultDb;
  constructor(params: { jobResult?: JobResultDb }) {
    this.jobResult = params.jobResult;
  }
}
