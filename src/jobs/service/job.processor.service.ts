import { Injectable } from '@nestjs/common';
import { Job } from './command/output/job';
import { EmailService } from './tasks/email.service';
import { ServiceInternalServerException } from './command/exceptions/ServiceInternalServerError.exception';
import { ImageProcessorService } from './tasks/image.processor..service';

@Injectable()
export class JobProcessorService {
  constructor(
    private readonly emailService: EmailService,
    private readonly imageProcessorService: ImageProcessorService,
  ) {}
  async executeJob(job: Job) {
    const task = job.payload.task;
    switch (task) {
      case 'send_email':
        return await this.emailService.execute(job.payload);
      case 'image_processing':
        return await this.imageProcessorService.executeJob(job.payload);
      default:
        throw new ServiceInternalServerException(
          'Something went wrong, not a valid task',
          task,
        );
    }
  }
}
