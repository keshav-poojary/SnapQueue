import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetTenantById {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the tenant' })
  id: string;
}
