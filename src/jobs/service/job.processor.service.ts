import { Injectable } from '@nestjs/common';
import { Job } from './command/output/job';
import { EmailService } from './tasks/email.service';
import { ServiceInternalServerException } from './command/exceptions/ServiceInternalServerError.exception';

@Injectable()
export class JobProcessorService {
  constructor(private readonly emailService: EmailService) {}
  async executeJob(job: Job): Promise<void> {
    const task = job.payload.task;
    switch (task) {
      case 'send_email':
        await this.emailService.execute(job.payload);
        break;
      default:
        throw new ServiceInternalServerException(
          'Something went wrong, not a valid task',
          task,
        );
    }
  }
}
