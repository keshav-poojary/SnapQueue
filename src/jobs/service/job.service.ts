import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { JobRepository } from '../database/job.repository';
import { CreateJobCommandInput } from './command/input/create-job.command.input';
import { CreateJobDbRequest } from '../database/db/request/create-job.db.request';
import { DbJobNotFoundException } from '../database/db/exceptions/DbJobNotFound.exception.';
import { ServiceJobNotFoundException } from './command/exceptions/ServiceNotFound.exception';
import { ServiceInternalServerException } from './command/exceptions/ServiceInternalServerError.exception';
import { QueueRepository } from 'src/queues/database/queue.repository';
import { DbQueueNotFoundException } from 'src/queues/database/db/exceptions/DbQueueNotFound.exception';
import { ServiceQueueNotFoundException } from 'src/queues/service/exceptions/ServiceNotFound.exception';
import { GetJobByIdCommandOutput } from './command/output/get-job-by-id.command.ouput';
import { GetJobByIdCommandInput } from './command/input/get-job-by-id.command.input';
import { GetJobResultCommandOutput } from './command/output/get-job-result.command.output';
@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly queueRepo: QueueRepository,
  ) {}

  async create(
    command: CreateJobCommandInput,
  ): Promise<GetJobByIdCommandOutput> {
    try {
      const queue = await this.queueRepo.getById({ queueId: command.queueId });
      const jobId = uuid();
      const now = new Date().toISOString();
      const dbRequest: CreateJobDbRequest = {
        jobId,
        queueUrl: queue.queueUrl!,
        queueId: command.queueId,
        tenantId: command.tenantId,
        payload: command.payload,
        createdAt: now,
        updatedAt: now,
      };
      await this.jobRepository.create(dbRequest);
      const result = await this.jobRepository.getById({
        jobId,
      });
      return new GetJobByIdCommandOutput({
        ...result,
      });
    } catch (error) {
      if (error instanceof DbJobNotFoundException) {
        throw new ServiceJobNotFoundException('Job not found', {
          context: error,
        });
      }

      if (error instanceof DbQueueNotFoundException) {
        throw new ServiceQueueNotFoundException('Queue not found', {
          context: error,
        });
      }

      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }

  async getById(
    command: GetJobByIdCommandInput,
  ): Promise<GetJobByIdCommandOutput> {
    try {
      const result = await this.jobRepository.getById({
        jobId: command.jobId,
      });
      return new GetJobByIdCommandOutput({
        ...result,
      });
    } catch (error) {
      if (error instanceof DbJobNotFoundException) {
        throw new ServiceJobNotFoundException('Job not found', {
          context: error,
        });
      }
      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }

  async getJobResult(
    command: GetJobByIdCommandInput,
  ): Promise<GetJobResultCommandOutput> {
    try {
      const result = await this.jobRepository.getJobResult({
        jobId: command.jobId,
      });
      return new GetJobResultCommandOutput({
        base64: result?.base64,
        contentType: result?.contentType,
      });
    } catch (error) {
      if (error instanceof DbJobNotFoundException) {
        throw new ServiceJobNotFoundException('Job not found', {
          context: error,
        });
      }
      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }
}
