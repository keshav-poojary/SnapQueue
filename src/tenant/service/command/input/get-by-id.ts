export class GetTenantByIdCommandInput {
  id: string;

  constructor(params: { id: string }) {
    this.id = params.id;
  }
}
