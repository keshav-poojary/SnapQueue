import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class GetAllTenantsRequestDto {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Limit of tenants to return' })
  limit?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Offset for pagination' })
  offset?: string;
}
