import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateQueueRequestDto {
  @ApiProperty({
    description: 'Unique identifier of the tenant creating the queue',
    example: '1996b504-20f5-4598-8f70-303bbaf4b677',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    description: 'Name of the queue to create (unique per tenant)',
    example: 'emailQueue',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Maximum number of retry attempts for failed jobs',
    example: 3,
    required: false,
    default: 3,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  retryLimit?: number = 3;

  @ApiProperty({
    description: 'Delay between retries in milliseconds',
    example: 5000,
    required: false,
    default: 5000,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  retryDelay?: number = 5000;
}
