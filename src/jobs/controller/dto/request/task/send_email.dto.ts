import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { JobPayloadTaskEnum } from 'src/jobs/constants/enum';

export class SendEmailPayloadDto {
  @IsString()
  @ApiProperty({
    description: 'The type of the task, must be "send_email"',
    enum: [JobPayloadTaskEnum.SEND_EMAIL],
  })
  task: JobPayloadTaskEnum.SEND_EMAIL;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email address of the recipient',
    format: 'email',
  })
  to: string;

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
