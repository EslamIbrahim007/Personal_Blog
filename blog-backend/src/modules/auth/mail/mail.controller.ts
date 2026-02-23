import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('test-mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async test(@Query('email') email: string) {
    try {
      await this.mailService.sendTestEmail(email || 'test@example.com');
      return { success: true, message: 'Email sent! Check Mailtrap inbox' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}