import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) { }


  async sendTestEmail(to: string) {
    try {
      await this.mailer.sendMail({
        to,
        subject: 'Test Email',
        text: 'Hello from NestJS!',
      });
      console.log('✅ Email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      throw error;
    }
  }

  async sendVerifyEmail(to: string, token: string): Promise<void> {
    const subject = 'Verify your email';
    const text =
      [
        'Welcome to PersonalBlog!',
        '',
        'Use this token to verify your email:',
        token,
        '',
        'If you did not request this, ignore this email.',
      ].join('\n');

    await this.mailer.sendMail({ to, subject, text });
  };

  async sendResetPassword(to: string, token: string): Promise<void> {
    const subject = 'Reset your password';
    const text =
      [
        'You requested a password reset.',
        '',
        'Use this token to reset your password:',
        token,
        '',
        'If you did not request this, ignore this email.',
      ].join('\n');

    await this.mailer.sendMail({ to, subject, text });
  }
}
