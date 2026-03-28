import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class BulkEmailService {
  constructor(private emailService: EmailService) {}

  async execute(payload: any) {
    const { recipients, subject, text } = payload;

    await Promise.all(
      recipients.map((to: string) => {
        this.emailService.execute({ to: to, subject: subject, text: text });
      }),
    );
  }
}
