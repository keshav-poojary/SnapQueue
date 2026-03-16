// polls job from sqs and sends to process
import {
  DeleteMessageCommand,
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

@Injectable()
export class WorkerService implements OnModuleInit {
  private readonly logger = new Logger(WorkerService.name);
  private readonly sqsClient: SQSClient;

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

    for (const queue of queuesResponse.queues) {
      this.pollQueue(queue);
    }
  }

  onModuleInit() {
    this.start();
  }

  async pollQueue(queue: QueueDb) {
    try {
      this.logger.log(`Processing queue ${queue.queueId}`);

      const result = await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: queue.queueUrl,
        }),
      );

      if (!result.Messages) {
        return;
      }

      for (const message of result.Messages) {
        this.processMessage(message, queue.queueUrl!);
      }
    } catch (error) {
      this.logger.error('Error polling queue', error);
      throw new ServiceInternalServerException(
        'Something went wrong while polling queue',
        error,
      );
    }
  }

  private async processMessage(message: any, queueUrl: string) {
    try {
      const body = JSON.parse(message.Body);
      const jobId = body.jobId;

      this.logger.log(`Processing job ${jobId}`);

      const job = await this.jobRepository.getById({ jobId });

      await this.jobRepository.updateJobStatus(
        jobId,
        JobStatusEnum.IN_PROGRESS,
      );

      await this.jobProcessor.executeJob(job);

      await this.jobRepository.updateJobStatus(jobId, JobStatusEnum.COMPLETED);

      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        }),
      );

      this.logger.log(`Job completed ${jobId}`);
    } catch (error) {
      this.logger.error('Job failed', error);
      throw new ServiceInternalServerException(
        'Something went wrong while processing message',
        error,
      );
    }
  }
}
