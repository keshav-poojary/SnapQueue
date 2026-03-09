import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateJobRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the queue to which the job belongs',
    format: 'uuid',
  })
  queueId: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The payload of the job, can be any JSON object',
    example: { task: 'send_email', to: 'user@example.com' },
  })
  payload: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the tenant to which the job belongs',
    format: 'uuid',
  })
  tenantId: string;
}
