import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { CreateTenantDbRequest } from './db/request/create';
import { GetTenantByIdDbResponse } from './db/response/get-by-id';
import { GetTenantByIdDbRequest } from './db/request/get-by-id';
import { DbTenantNotFoundException } from './db/exceptions/DbTenantNotFound.exception';
import { DbInternalServerException } from './db/exceptions/DbInternalServerError.exception';
import { GetTenantsDbResponse } from './db/response/get-all';
import { GetTenantsDbRequest } from './db/request/get-all';
import { TenantDb } from './db/common/tenant';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantRepository {
  private dynamodbClient: DynamoDBDocumentClient;
  private tenantTable: string;

  constructor(private configService: ConfigService) {
    const tableName = this.configService.get<string>('TENANT_TABLE');
    const region = this.configService.get<string>('AWS_REGION');

    if (!tableName) throw new Error('TENANT_TABLE not set');
    if (!region) throw new Error('AWS_REGION not set');

    const baseClient = new DynamoDBClient({ region });
    this.dynamodbClient = DynamoDBDocumentClient.from(baseClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
    this.tenantTable = tableName;
  }

  async create(req: CreateTenantDbRequest): Promise<void> {
    try {
      await this.dynamodbClient.send(
        new PutCommand({
          TableName: this.tenantTable,
          Item: req,
        }),
      );
    } catch (error) {
      throw new DbInternalServerException('Something went wrong', error);
    }
  }

  async getById(req: GetTenantByIdDbRequest): Promise<GetTenantByIdDbResponse> {
    try {
      const result = await this.dynamodbClient.send(
        new GetCommand({
          TableName: this.tenantTable,
          Key: { tenantId: req.id },
        }),
      );

      if (!result.Item) {
        throw new DbTenantNotFoundException('Tenant not found', {
          tenantId: req.id,
        });
      }

      return result.Item as GetTenantByIdDbResponse;
    } catch (error) {
      if (error instanceof DbTenantNotFoundException) throw error;
      throw new DbInternalServerException('Something went wrong', error);
    }
  }

  async query(req: GetTenantsDbRequest): Promise<GetTenantsDbResponse> {
    try {
      let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

      if (req.offset) {
        lastEvaluatedKey = JSON.parse(
          Buffer.from(req.offset, 'base64').toString('utf8'),
        );
      }

      const result = await this.dynamodbClient.send(
        new ScanCommand({
          TableName: this.tenantTable,
          Limit: req.limit,
          ExclusiveStartKey: lastEvaluatedKey,
        }),
      );

      const nextOffset = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            'base64',
          )
        : undefined;

      const tenants = result.Items?.map((item) => item as TenantDb) ?? [];

      return new GetTenantsDbResponse({
        tenants,
        offset: nextOffset,
      });
    } catch (error) {
      throw new DbInternalServerException('Something went wrong', error);
    }
  }
}
