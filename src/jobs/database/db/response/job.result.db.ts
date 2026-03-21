export class JobResultDb {
  base64: string;
  contentType: string;
  constructor(params: { base64: string; contentType: string }) {
    this.base64 = params.base64;
    this.contentType = params.contentType;
  }
}
