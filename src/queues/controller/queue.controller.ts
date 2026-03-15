import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceInternalServerException } from '../service/exceptions/ServiceInternalServerError.exception';
import { QueueService } from '../service/queue.service';
import { CreateQueueRequestDto } from './dto/request/create.dto';
import { GetQueueByIdResponseDto } from './dto/response/get-by-id.dto';
import { ServiceQueueNotFoundException } from '../service/exceptions/ServiceNotFound.exception';
import { ServiceTenantNotFoundException } from 'src/tenants/service/exceptions/ServiceNotFound.exception';
import { TenantAuthGuard } from 'src/guards/tenant-auth-guard';

@Controller({
  path: 'queues',
  version: '0',
})
@UseGuards(TenantAuthGuard)
@ApiTags('Queues')
export class QueuesController {
  constructor(private readonly queueService: QueueService) {}
  @Post('/')
  @ApiHeader({
    name: 'x-api-key',
    description: 'Tenant API key',
    required: true,
  })
  @ApiOperation({ summary: 'Create a new queue' })
  @ApiCreatedResponse({
    description: 'The queue has been successfully created.',
    type: GetQueueByIdResponseDto,
  })
  async create(@Body() request: CreateQueueRequestDto) {
    try {
      const result: GetQueueByIdResponseDto =
        await this.queueService.create(request);
      return result;
    } catch (error) {
      if (error instanceof ServiceQueueNotFoundException) {
        throw new NotFoundException(`Queue was created but not found`);
      }
      if (error instanceof ServiceTenantNotFoundException) {
        throw new NotFoundException(
          `Tenant provided in request does not exists`,
        );
      }
      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while creating queue`,
        );
      }
      throw error;
    }
  }

  @Get('/:id')
  @ApiHeader({
    name: 'x-api-key',
    description: 'Tenant API key',
    required: true,
  })
  @ApiOperation({ summary: 'Get queue by ID' })
  @ApiOkResponse({
    description: 'The queue detail by id',
    type: GetQueueByIdResponseDto,
  })
  async getById(@Param('id') id: string) {
    try {
      const result: GetQueueByIdResponseDto = await this.queueService.getById({
        queueId: id,
      });
      return result;
    } catch (error) {
      if (error instanceof ServiceQueueNotFoundException) {
        throw new NotFoundException(`Queue not found`);
      }
      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while fetching queue`,
        );
      }
      throw error;
    }
  }
}
