import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { JobPayloadTaskEnum } from '../../../../constants/enum';

export class BulkEmailPayloadDto {
  @IsString()
  @ApiProperty({
    description: 'The type of the task, must be "bulk_send_email"',
    enum: [JobPayloadTaskEnum.BULK_SEND_EMAIL],
  })
  task: JobPayloadTaskEnum.BULK_SEND_EMAIL;

  @IsArray()
  @ApiProperty({
    description: 'The email addresses of the recipients',
    type: [String],
    format: 'email',
  })
  recepients: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The subject of the email',
  })
  subject?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The text content of the email',
  })
  text?: string;
}
