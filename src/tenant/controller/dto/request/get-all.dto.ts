import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class GetAllTenantsRequestDto {
  @IsPositive()
  @IsNumber()
  @ApiProperty({ description: 'Limit of tenants to return' })
  limit: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Offset for pagination' })
  offset: string;
}
