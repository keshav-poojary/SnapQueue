import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateQueueDbRequest } from './db/request/create.db';
import {
  SQSClient,
  CreateQueueCommand,
  GetQueueAttributesCommand,
} from '@aws-sdk/client-sqs';
import { QueueDb } from './db/common/queue.db';
import { DbInternalServerException } from './db/exceptions/DbInternalServerError.exception';
import { GetQueueByIdDbRequest } from './db/request/get-by-id.db';
import { GetQueueByIdDbResponse } from './db/response/get-by-id.db';
import { DbQueueNotFoundException } from './db/exceptions/DbQueueNotFound.exception';
@Injectable()
export class QueueRepository {
  private dynamodbClient: DynamoDBDocumentClient;
  private sqsClient: SQSClient;
  private queueTable: string;

  constructor(private configService: ConfigService) {
    const tableName = this.configService.get<string>('QUEUE_TABLE');
    const region = this.configService.get<string>('AWS_REGION');

    if (!tableName) throw new Error('QUEUE_TABLE not set');
    if (!region) throw new Error('AWS_REGION not set');

    const baseClient = new DynamoDBClient({ region });
    this.dynamodbClient = DynamoDBDocumentClient.from(baseClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
    this.sqsClient = new SQSClient({ region });
    this.queueTable = tableName;
  }

  async create(req: CreateQueueDbRequest): Promise<void> {
    try {
      const queueResponse = await this.sqsClient.send(
        new CreateQueueCommand({
          QueueName: req.queueName,
          Attributes: {
            MessageRetentionPeriod: '864000',
          },
        }),
      );

      const queueUrl = queueResponse.QueueUrl;

      const queueAttributes = await this.sqsClient.send(
        new GetQueueAttributesCommand({
          QueueUrl: queueUrl,
          AttributeNames: ['QueueArn'],
        }),
      );

      const queueArn = queueAttributes.Attributes?.QueueArn;
      const item: QueueDb = {
        tenantId: req.tenantId,
        queueId: req.queueId,
        name: req.name,
        queueUrl,
        queueArn,
        retryLimit: req.retryLimit ?? 3,
        retryDelay: req.retryDelay ?? 5000,
        createdAt: req.createdAt,
      };

      await this.dynamodbClient.send(
        new PutCommand({
          TableName: this.queueTable,
          Item: item,
        }),
      );
    } catch (error) {
      throw new DbInternalServerException('Something went wrong', error);
    }
  }

  async getById(req: GetQueueByIdDbRequest): Promise<GetQueueByIdDbResponse> {
    try {
      const result = await this.dynamodbClient.send(
        new GetCommand({
          TableName: this.queueTable,
          Key: { queueId: req.queueId },
        }),
      );

      if (!result.Item) {
        throw new DbQueueNotFoundException('QUEUE not found', {
          tenantId: req.queueId,
        });
      }

      return result.Item as GetQueueByIdDbResponse;
    } catch (error) {
      if (error instanceof DbQueueNotFoundException) throw error;
      throw new DbInternalServerException('Something went wrong', error);
    }
  }
}
