import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ImageProcessingPayloadDto } from './task/image_processing.dto';
import { SendEmailPayloadDto } from './task/send_email.dto';
import { BulkEmailPayloadDto } from './task/bulk_email.dto';
import { GeneratePdfPayloadDto } from './task/generate_pdf.dto';

@ApiExtraModels(
  ImageProcessingPayloadDto,
  SendEmailPayloadDto,
  BulkEmailPayloadDto,
)
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
    oneOf: [
      { $ref: getSchemaPath(ImageProcessingPayloadDto) },
      { $ref: getSchemaPath(SendEmailPayloadDto) },
      { $ref: getSchemaPath(BulkEmailPayloadDto) },
      { $ref: getSchemaPath(GeneratePdfPayloadDto) },
    ],
  })
  payload:
    | ImageProcessingPayloadDto
    | SendEmailPayloadDto
    | BulkEmailPayloadDto
    | GeneratePdfPayloadDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the tenant to which the job belongs',
    format: 'uuid',
  })
  tenantId: string;
}
