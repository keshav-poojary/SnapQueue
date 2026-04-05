import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobPayloadTaskEnum } from '../../../../constants/enum';

export class GenerateImagePayloadDto {
  @IsString()
  @ApiProperty({
    description: 'The type of the task, must be "generate_image"',
    enum: [JobPayloadTaskEnum.GENERATE_IMAGE],
  })
  task: JobPayloadTaskEnum.GENERATE_IMAGE;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The HTML content to be converted to image',
  })
  htmlContent: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The file name of the generated image',
    example: 'preview.png',
  })
  fileName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Width of the image (px)',
    example: 1200,
  })
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Height of the image (px)',
    example: 800,
  })
  height?: number;

  @IsBoolean()
  @ApiProperty({
    description:
      'Whether the generated image should be uploaded to a storage service',
  })
  upload: boolean;
}
