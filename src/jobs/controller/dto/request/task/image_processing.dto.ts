import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { JobPayloadTaskEnum } from '../../../../constants/enum';

export class ImageProcessingPayloadDto {
  @IsString()
  @ApiProperty({
    description: 'The type of the task, must be "image_processing"',
    enum: [JobPayloadTaskEnum.IMAGE_PROCESSING],
  })
  task: JobPayloadTaskEnum.IMAGE_PROCESSING;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The URL of the image to be processed',
    format: 'url',
  })
  url: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'The width of the processed image',
    minimum: 1,
  })
  width?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'The height of the processed image',
    minimum: 1,
  })
  height?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The format of the processed image',
    enum: ['jpeg', 'png', 'webp'],
  })
  format?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'The quality of the processed image (for lossy formats)',
    minimum: 1,
    maximum: 100,
  })
  quality?: number;
}
