import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly emailUserId: string | undefined;
  private readonly emailAuthId: string | undefined;
  private transporter;

  constructor(private configService: ConfigService) {
    this.emailUserId = this.configService.get<string>('EMAIL_KEY');
    this.emailAuthId = this.configService.get<string>('EMAIL_PASS');

    console.log(this.emailAuthId, this.emailUserId);
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.emailUserId,
        pass: this.emailAuthId,
      },
    });
  }

  async execute(payload: any) {
    const { to, subject, text } = payload;

    await this.transporter.sendMail({
      from: `"Job Worker" <${this.emailUserId}>`,
      to: to,
      subject: subject || 'Notification',
      text: text || 'Hello from worker service',
    });
  }
}
