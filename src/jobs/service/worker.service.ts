// polls job from sqs and sends to process
import {
  DeleteMessageCommand,
  Message,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueDb } from 'src/queues/database/db/common/queue.db';
import { QueueRepository } from 'src/queues/database/queue.repository';
import { JobRepository } from '../database/job.repository';
import { JobStatusEnum } from '../constants/enum';
import { ServiceInternalServerException } from './command/exceptions/ServiceInternalServerError.exception';
import { JobProcessorService } from './job.processor.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DbJobNotFoundException } from '../database/db/exceptions/DbJobNotFound.exception.';
import { JobDb } from '../database/db/response/job.db';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);
  private readonly MAX_NUMBER_OF_MESSAGES = 10;
  private readonly WAIT_TIME_SECONDS = 20;
  private readonly sqsClient: SQSClient;
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly configService: ConfigService,
    private readonly queueRepo: QueueRepository,
    private readonly jobRepository: JobRepository,
    private readonly jobProcessor: JobProcessorService,
  ) {
    const region = this.configService.get<string>('AWS_REGION');
    this.sqsClient = new SQSClient({ region });
  }

  async start() {
    this.logger.log('Worker Started');
    const queuesResponse = await this.queueRepo.getAll({});

    await Promise.all(
      queuesResponse.queues.map((queue) => {
        this.pollQueue(queue);
      }),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async cronSchedule() {
    await this.start();
  }

  async pollQueue(queue: QueueDb) {
    try {
      this.logger.log(`Processing queue ${queue.queueId}`);

      const result = await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: queue.queueUrl,
          MaxNumberOfMessages: this.MAX_NUMBER_OF_MESSAGES,
          WaitTimeSeconds: this.WAIT_TIME_SECONDS,
        }),
      );

      if (!result.Messages) {
        return;
      }

      await Promise.all(
        result.Messages.map((message) => {
          this.processMessage(message, queue.queueUrl!);
        }),
      );
    } catch (error) {
      this.logger.error('Error polling queue', error);
      throw new ServiceInternalServerException(
        'Something went wrong while polling queue',
        error,
      );
    }
  }

  private async deleteMessage(queueUrl: string, message: Message) {
    if (!message.ReceiptHandle) return;

    await this.sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      }),
    );
  }

  private async safeDeleteMessage(queueUrl: string, message: Message) {
    try {
      await this.deleteMessage(queueUrl, message);
    } catch (err) {
      this.logger.error('Failed to delete message', err);
    }
  }

  private async handleProcessError(
    error: unknown,
    message: Message,
    queueUrl: string,
    jobId?: string,
  ) {
    this.logger.error('Job failed', error);

    if (error instanceof DbJobNotFoundException) {
      this.logger.error(`Job not found, deleting message ${jobId}`);

      await this.safeDeleteMessage(queueUrl, message);
    }
  }

  private async executeWithRetry(jobId: string, job: JobDb) {
    let attempts = 0;

    while (attempts < this.MAX_RETRIES) {
      try {
        const result = await this.jobProcessor.executeJob(job);

        return { success: true, data: result, attempts: attempts + 1 };
      } catch (error) {
        attempts++;

        this.logger.error(`Attempt ${attempts} failed for job ${jobId}`, error);

        if (attempts >= this.MAX_RETRIES) {
          return { success: false, attempts };
        }
      }
    }

    return { success: false, attempts };
  }

  private async processMessage(message: Message, queueUrl: string) {
    let jobId: string = '';

    try {
      const body = JSON.parse(message.Body as string);
      jobId = body.jobId;

      this.logger.log(`Processing job ${jobId}`);

      const job = await this.jobRepository.getById({ jobId });

      await this.jobRepository.updateJobStatus(
        jobId,
        JobStatusEnum.IN_PROGRESS,
      );

      const result = await this.executeWithRetry(jobId, job);

      if (result.success) {
        await this.jobRepository.updateJobStatus(
          jobId,
          JobStatusEnum.COMPLETED,
          result.data,
        );

        await this.deleteMessage(queueUrl, message);
        this.logger.log(`Job completed ${jobId}`);
        return;
      }

      await this.jobRepository.updateJobStatus(
        jobId,
        JobStatusEnum.FAILED,
        undefined,
        result.attempts,
      );

      this.logger.error(
        `Job failed after ${result.attempts} attempts ${jobId}`,
      );
    } catch (error: unknown) {
      await this.handleProcessError(error, message, queueUrl, jobId);
    }
  }
}
