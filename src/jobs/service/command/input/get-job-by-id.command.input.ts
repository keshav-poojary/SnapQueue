export class GetJobByIdCommandInput {
  jobId: string;
  constructor(params: { jobId: string }) {
    this.jobId = params.jobId;
  }
}
