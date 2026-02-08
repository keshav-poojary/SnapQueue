import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class QueueDto {
  @ApiProperty({
    description: 'Unique identifier of the tenant owning this queue',
    example: '1996b504-20f5-4598-8f70-303bbaf4b677',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    description: 'Name of the queue (unique per tenant)',
    example: 'emailQueue',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique identifier of the queue',
    example: 'queue_1234abcd-56ef-7890-gh12-ijkl3456mnop',
  })
  @IsString()
  @IsOptional()
  queueId?: string;

  @ApiProperty({
    description: 'AWS SQS Queue URL for this queue',
    example:
      'https://sqs.ap-south-1.amazonaws.com/763997220672/tenant_123_emailQueue',
  })
  @IsUrl()
  @IsOptional()
  queueUrl?: string;

  @ApiProperty({
    description: 'AWS SQS Queue ARN for this queue',
    example: 'arn:aws:sqs:ap-south-1:763997220672:tenant_123_emailQueue',
  })
  @IsString()
  @IsOptional()
  queueArn?: string;

  @ApiProperty({
    description: 'Maximum retry attempts for failed jobs in this queue',
    example: 3,
    default: 3,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  retryLimit?: number = 3;

  @ApiProperty({
    description: 'Delay between retries in milliseconds',
    example: 5000,
    default: 5000,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  retryDelay?: number = 5000;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Creation timestamp of the queue' })
  createdAt: string;
}
