import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(to, subject, template, context) {
   try { 
    return this.mailerService.sendMail({
      to: to,
      from: '1610878@hcmut.edu.vn',
      subject: subject,
      template: `./${template}`,
      context: context
    });
   } catch (error) {
     console.log(error)
    }
  }
}