import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetQueueByIdRequestDto {
  @ApiProperty({
    description: 'Unique identifier of the queue to retrieve',
    example: 'queue_1234abcd-56ef-7890-gh12-ijkl3456mnop',
  })
  @IsString()
  @IsNotEmpty()
  queueId: string;
}
