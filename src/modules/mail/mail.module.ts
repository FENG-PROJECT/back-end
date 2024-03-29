import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { resolve } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT, 10) || 465,
        secure: true, //process.env.SMTP_SECURE === 'true',
        // ignoreTLS: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_AUTH_USER || 'feng.customerservice@gmail.com',
          pass: process.env.SMTP_AUTH_PASS || 'A123456789@',
        },
        from: process.env.SMTP_AUTH_USER || 'feng.customerservice@gmail.com',
      },
      template: {
        dir: resolve(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
