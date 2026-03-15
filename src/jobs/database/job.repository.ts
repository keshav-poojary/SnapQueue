import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateJobDbRequest } from './db/request/create-job.db.request';
import { JobDb } from './db/response/job.db';
import { JobStatusEnum } from '../constants/enum';
import { GetJobByIdDbRequest } from './db/request/get-job-by-id.db.request';
import { GetJobByIdDbResponse } from './db/response/get-job-by-id.db.response';
import { DbJobNotFoundException } from './db/exceptions/DbJobNotFound.exception.';
import { DbInternalServerException } from './db/exceptions/DbInternalServerError.exception';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

@Injectable()
export class JobRepository {
  private dynamodbClient: DynamoDBDocumentClient;
  private sqsClient: SQSClient;
  private jobTable: string;

  constructor(private configService: ConfigService) {
    const tableName = this.configService.get<string>('JOB_TABLE');
    const region = this.configService.get<string>('AWS_REGION');

    if (!tableName) throw new Error('JOB_TABLE not set');
    if (!region) throw new Error('AWS_REGION not set');

    const baseClient = new DynamoDBClient({ region });
    this.sqsClient = new SQSClient({ region });
    this.dynamodbClient = DynamoDBDocumentClient.from(baseClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
    this.jobTable = tableName;
  }

  async create(req: CreateJobDbRequest): Promise<void> {
    try {
      const item: JobDb = new JobDb({
        jobId: req.jobId,
        queueId: req.queueId,
        queueUrl: req.queueUrl,
        tenantId: req.tenantId,
        payload: req.payload,
        attempts: 0,
        jobStatus: JobStatusEnum.INITIALIZED,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,
      });

      // Step 1: Save job in DynamoDB
      await this.dynamodbClient.send(
        new PutCommand({
          TableName: this.jobTable,
          Item: item,
        }),
      );

      // Step 3: Send job to SQS
      await this.sqsClient.send(
        new SendMessageCommand({
          QueueUrl: req.queueUrl,
          MessageBody: JSON.stringify({
            payload: req.payload,
            jobId: req.jobId,
            queueId: req.queueId,
            tenantId: req.tenantId,
          }),
        }),
      );

      // Step 4: Update job status to QUEUED
      await this.dynamodbClient.send(
        new UpdateCommand({
          TableName: this.jobTable,
          Key: { jobId: req.jobId },
          UpdateExpression: 'SET jobStatus = :status, updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':status': JobStatusEnum.QUEUED,
            ':updatedAt': new Date().toISOString(),
          },
        }),
      );
    } catch (error) {
      throw new DbInternalServerException('Failed to create job', error);
    }
  }

  async getById(req: GetJobByIdDbRequest): Promise<GetJobByIdDbResponse> {
    try {
      const result = await this.dynamodbClient.send(
        new GetCommand({
          TableName: this.jobTable,
          Key: {
            jobId: req.jobId,
          },
        }),
      );

      if (!result.Item) {
        throw new DbJobNotFoundException('Job not found', {
          jobId: req.jobId,
        });
      }

      return result.Item as GetJobByIdDbResponse;
    } catch (error) {
      if (error instanceof DbJobNotFoundException) throw error;
      throw new DbInternalServerException('Something went wrong', error);
    }
  }

  async updateJobStatus(jobId: string, status: JobStatusEnum): Promise<void> {
    try {
      await this.dynamodbClient.send(
        new UpdateCommand({
          TableName: this.jobTable,
          Key: { jobId },
          UpdateExpression: 'SET jobStatus = :status, updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': new Date().toISOString(),
          },
        }),
      );
    } catch (error) {
      throw new DbInternalServerException('Failed to update job status', error);
    }
  }
}
