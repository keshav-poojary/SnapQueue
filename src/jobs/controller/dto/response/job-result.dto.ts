import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64, IsOptional, IsString } from 'class-validator';

export class JobResultDto {
  @IsBase64()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Base64 encoded result of the job',
    example: 'iVBORw0KGgoAAAANSUhEUgAAAAUA',
  })
  base64?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Content type of the job result',
    example: 'application/json',
  })
  contentType?: string;
}
