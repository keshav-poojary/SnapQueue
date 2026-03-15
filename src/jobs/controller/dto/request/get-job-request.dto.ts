import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetJobRequestDto {
  @ApiProperty({
    example: 'c3c9e4b0-9a6b-4c3d-8c0e-2e9f9c4d9f11',
    description: 'Unique job identifier',
    format: 'uuid',
  })
  @IsUUID()
  jobId: string;
}
