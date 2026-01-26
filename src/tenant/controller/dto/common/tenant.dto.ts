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
  id: string;

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

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Last update timestamp of the tenant' })
  updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Created by user' })
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Updated by user' })
  updatedBy: string;
}
