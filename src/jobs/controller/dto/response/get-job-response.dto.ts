import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsObject, IsDateString, IsEnum } from 'class-validator';
import { JobStatusEnum } from '../../../constants/enum';

export class GetJobResponseDto {
  @ApiProperty({
    example: 'c3c9e4b0-9a6b-4c3d-8c0e-2e9f9c4d9f11',
    description: 'Unique job identifier',
    format: 'uuid',
  })
  @IsUUID()
  jobId: string;

  @ApiProperty({
    example: 'd7f1c8a2-5c6b-4b2c-9e77-9d3c9c6e7a21',
    description: 'Queue ID where the job belongs',
    format: 'uuid',
  })
  @IsUUID()
  queueId: string;

  @ApiProperty({
    example: 'a1c9e4b0-7d2f-4c3d-b8c0-5e9f9c4d1a22',
    description: 'Tenant ID that owns the job',
    format: 'uuid',
  })
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    example: {
      email: 'user@test.com',
      subject: 'Welcome',
    },
    description: 'Job payload data',
  })
  @IsObject()
  payload: Record<string, any>;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Job creation timestamp',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Last job update timestamp',
  })
  @IsDateString()
  updatedAt: string;

  @ApiProperty({
    enum: JobStatusEnum,
    example: JobStatusEnum.QUEUED,
    description: 'Current job status',
  })
  @IsEnum(JobStatusEnum)
  jobStatus: JobStatusEnum;
}
