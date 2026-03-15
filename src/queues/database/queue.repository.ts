import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
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
import { GetAllQueuesDbRequest } from './db/request/get-all.db';
import { GetAllQueuesDbResponse } from './db/response/get-all.db';
@Injectable()
export class QueueRepository {
  private dynamodbClient: DynamoDBDocumentClient;
  private sqsClient: SQSClient;
  private queueTable: string;
  private readonly MESSAGE_RETENTION_PERIOD = '864000';
  private readonly DEFAULT_RETRY_LIMIT = 3;
  private readonly DEFAULT_RETRY_DELAY = 5000;

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
            MessageRetentionPeriod: this.MESSAGE_RETENTION_PERIOD,
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
        retryLimit: req.retryLimit ?? this.DEFAULT_RETRY_LIMIT,
        retryDelay: req.retryDelay ?? this.DEFAULT_RETRY_DELAY,
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

  async getAll(req: GetAllQueuesDbRequest): Promise<GetAllQueuesDbResponse> {
    try {
      let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

      if (req.offset) {
        lastEvaluatedKey = JSON.parse(
          Buffer.from(req.offset, 'base64').toString('utf8'),
        );
      }

      const result = await this.dynamodbClient.send(
        new ScanCommand({
          TableName: this.queueTable,
          Limit: req.limit,
          ExclusiveStartKey: lastEvaluatedKey,
        }),
      );

      const nextOffset = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            'base64',
          )
        : undefined;

      const queues =
        result.Items?.map((item) => unmarshall(item) as QueueDb) ?? [];

      return new GetAllQueuesDbResponse({
        queues,
        offset: nextOffset,
      });
    } catch (error) {
      throw new DbInternalServerException('Something went wrong', error);
    }
  }
}
