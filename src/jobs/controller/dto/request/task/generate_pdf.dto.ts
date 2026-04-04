import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JobPayloadTaskEnum } from '../../../../constants/enum';

export class GeneratePdfPayloadDto {
  @IsString()
  @ApiProperty({
    description: 'The type of the task, must be "generate_pdf"',
    enum: [JobPayloadTaskEnum.GENERATE_PDF],
  })
  task: JobPayloadTaskEnum.GENERATE_PDF;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The HTML content to be converted to PDF',
  })
  htmlContent: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The title of the generated PDF',
  })
  fileName?: string;

  @IsBoolean()
  @ApiProperty({
    description:
      'Whether the generated PDF should be uploaded to a storage service',
  })
  upload: boolean;
}
