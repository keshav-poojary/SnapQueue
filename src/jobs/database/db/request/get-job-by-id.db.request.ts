export class GetJobByIdDbRequest {
  jobId: string;
  constructor(params: { jobId: string }) {
    this.jobId = params.jobId;
  }
}
