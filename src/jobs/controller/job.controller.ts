import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JobService } from '../service/job.service';
import { CreateJobResponseDto } from './dto/response/create-job-response.dto';
import { CreateJobRequestDto } from './dto/request/create-job.request.dto';
import { ServiceJobNotFoundException } from '../service/command/exceptions/ServiceNotFound.exception';
import { ServiceInternalServerException } from 'src/tenants/service/exceptions/ServiceInternalServerError.exception';
import { TenantAuthGuard } from 'src/guards/tenant-auth-guard';
import { ServiceQueueNotFoundException } from 'src/queues/service/exceptions/ServiceNotFound.exception';
import { GetJobResponseDto } from './dto/response/get-job-response.dto';
import { GetJobResultResponseDto } from './dto/response/get-job-result-rersponse.dto';
import { ServiceInvalidJobException } from '../service/command/exceptions/ServiceInvalidJobException';

@Controller({
  path: 'jobs',
  version: '0',
})
@ApiTags('Jobs')
@UseGuards(TenantAuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new job' })
  @ApiCreatedResponse({
    description: 'The job has been successfully created.',
    type: CreateJobResponseDto,
  })
  async create(@Body() request: CreateJobRequestDto) {
    try {
      const result: CreateJobResponseDto =
        await this.jobService.create(request);

      return result;
    } catch (error) {
      if (error instanceof ServiceJobNotFoundException) {
        throw new NotFoundException(`Job was created but not found`);
      }

      if (error instanceof ServiceQueueNotFoundException) {
        throw new NotFoundException(`Queue not found for this job`);
      }

      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while creating job`,
        );
      }

      throw error;
    }
  }

  @Get('/:jobId')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiOkResponse({
    description: 'The job has been successfully retrieved.',
    type: GetJobResponseDto,
  })
  async getById(@Param('jobId') jobId: string) {
    try {
      const result: GetJobResponseDto = await this.jobService.getById({
        jobId,
      });
      return result;
    } catch (error) {
      if (error instanceof ServiceJobNotFoundException) {
        throw new NotFoundException(`Job with ID ${jobId} not found`);
      }

      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while retrieving job with ID ${jobId}`,
        );
      }
      throw error;
    }
  }

  @Get('/:jobId/result')
  @ApiOperation({ summary: 'Get job result by ID' })
  @ApiOkResponse({
    description: 'The job result has been successfully retrieved.',
    type: GetJobResultResponseDto,
  })
  async getJobResult(@Param('jobId') jobId: string, @Res() res) {
    try {
      const result: GetJobResultResponseDto | undefined =
        await this.jobService.getJobResult({ jobId });
      if (!result || !result.base64 || !result.contentType) {
        return [];
      }
      const buffer = Buffer.from(result.base64, 'base64');
      res.setHeader('Content-Type', result.contentType);
      res.send(buffer);
      return result;
    } catch (error) {
      if (error instanceof ServiceInvalidJobException) {
        throw new NotFoundException(
          `This type of jobs does not support result retrieval`,
        );
      }
      if (error instanceof ServiceJobNotFoundException) {
        throw new NotFoundException(`Job with ID  ${jobId} not found`);
      }

      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while retrieving job result for job with ID ${jobId}`,
        );
      }
      throw error;
    }
  }
}
