import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(to, subject, template, context) {
    try {
      return this.mailerService.sendMail({
        to: to,
        from: process.env.SMTP_AUTH_USER,
        subject: subject,
        template: `./${template}`,
        context: context,
      });
    } catch (error) {
      console.log(error, 'error');
    }
  }
}
