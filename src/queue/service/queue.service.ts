import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../database/queue.repository';
import { CreateQueueCommandInput } from './command/input/create';
import { CreateQueueDbRequest } from '../database/db/request/create.db';
import { v4 as uuid } from 'uuid';
import { getQueueByIdCommandOutput } from './command/output/get-by-id';
import { DbQueueNotFoundException } from '../database/db/exceptions/DbQueueNotFound.exception';
import { GetQueueByIdCommandInput } from './command/input/get-by-id';
import { ServiceQueueNotFoundException } from './exceptions/ServiceNotFound.exception';
import { ServiceInternalServerException } from './exceptions/ServiceInternalServerError.exception';

@Injectable()
export class QueueService {
  constructor(private queueRepository: QueueRepository) {}
  async create(command: CreateQueueCommandInput) {
    try {
      const queueId = uuid();
      const queueName = `${command.tenantId}-${command.name}`;

      const dbRequest: CreateQueueDbRequest = {
        queueId,
        queueName,
        createdAt: new Date().toISOString(),
        ...command,
      };

      await this.queueRepository.create(dbRequest);

      const result = await this.queueRepository.getById({ queueId: queueId });

      return new getQueueByIdCommandOutput({
        ...result,
      });
    } catch (error) {
      if (error instanceof DbQueueNotFoundException) {
        throw new ServiceQueueNotFoundException('Queue Not found', {
          context: error,
        });
      }
      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }

  async getById(command: GetQueueByIdCommandInput) {
    try {
      const result = await this.queueRepository.getById({
        queueId: command.queueId,
      });

      return new getQueueByIdCommandOutput({
        ...result,
      });
    } catch (error) {
      if (error instanceof DbQueueNotFoundException) {
        throw new ServiceQueueNotFoundException('Queue Not found', {
          context: error,
        });
      }
      throw new ServiceInternalServerException('Something went wrong', {
        context: error,
      });
    }
  }
}
