import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTenantRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the tenant' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'Description of the tenant', required: false })
  description?: string;
}
