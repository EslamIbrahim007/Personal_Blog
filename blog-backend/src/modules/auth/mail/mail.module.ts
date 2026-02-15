import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('SMTP_HOST');
        const port = Number(config.get<string>('SMTP_PORT') ?? '587');
        const user = config.get<string>('SMTP_USER');
        const pass = config.get<string>('SMTP_PASS');
        const from = config.get<string>('MAIL_FROM');

        // Nodemailer: secure=true غالبًا مع 465، و false مع 587 (STARTTLS). :contentReference[oaicite:2]{index=2}
        const secure = port === 465;

        return {
          transport: {
            host,
            port,
            secure,
            auth: user && pass ? { user, pass } : undefined,
          },
          defaults: {
            from,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
