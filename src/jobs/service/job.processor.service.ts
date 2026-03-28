import { Injectable } from '@nestjs/common';
import { Job } from './command/output/job';
import { EmailService } from './tasks/email.service';
import { ServiceInternalServerException } from './command/exceptions/ServiceInternalServerError.exception';
import { ImageProcessorService } from './tasks/image.processor..service';
import { BulkEmailService } from './tasks/bulk.email.service';

@Injectable()
export class JobProcessorService {
  constructor(
    private readonly emailService: EmailService,
    private readonly imageProcessorService: ImageProcessorService,
    private readonly bulkEmailservice: BulkEmailService,
  ) {}
  async executeJob(job: Job) {
    const task = job.payload.task;
    switch (task) {
      case 'send_email':
        return await this.emailService.execute(job.payload);
      case 'image_processing':
        return await this.imageProcessorService.executeJob(job.payload);
      case 'bulk_send_email':
        return await this.bulkEmailservice.execute(job.payload);
      default:
        throw new ServiceInternalServerException(
          'Something went wrong, not a valid task',
          task,
        );
    }
  }
}
