import { ApiProperty } from '@nestjs/swagger';
import { TenantDto } from '../common/tenant.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GetTenantsResponseDto {
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [TenantDto], description: 'List of tenants' })
  tenants: TenantDto[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'Offset for pagination', required: false })
  offset?: string;
}
