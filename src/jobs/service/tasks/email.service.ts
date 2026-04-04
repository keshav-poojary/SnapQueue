import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly emailUserId: string | undefined;
  private readonly emailAuthId: string | undefined;
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly PORT = 587;

  constructor(private configService: ConfigService) {
    this.emailUserId = this.configService.get<string>('EMAIL_KEY');
    this.emailAuthId = this.configService.get<string>('EMAIL_PASS');

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: this.PORT,
      secure: false,
      auth: {
        user: this.emailUserId,
        pass: this.emailAuthId,
      },
    });
  }

  async execute(payload: any) {
    const { to, subject, text } = payload;
    this.logger.log(`Sending email to ${to} with subject ${subject}`);
    await this.transporter.sendMail({
      from: `"Job Worker" <${this.emailUserId}>`,
      to: to,
      subject: subject || 'Notification',
      text: text || 'Hello from worker service',
    });
  }
}
