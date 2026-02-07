import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class TenantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the tenant' })
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the tenant' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'Description of the tenant', required: false })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'API key of the tenant' })
  apiKey: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Creation timestamp of the tenant' })
  createdAt: Date;
}
