import { Module } from "@nestjs/common";
import { QueuesController } from "./controller/queue.controller";
import { QueueService } from "./service/queue.service";
import { QueueRepository } from "./database/queue.repository";

@Module({
  imports: [],
  controllers: [QueuesController],
  providers: [QueueService, QueueRepository],
})
export class QueueModule {}
