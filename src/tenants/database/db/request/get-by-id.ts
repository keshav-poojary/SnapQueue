export class GetTenantByIdDbRequest {
  id: string;

  constructor(params: { id: string }) {
    this.id = params.id;
  }
}
