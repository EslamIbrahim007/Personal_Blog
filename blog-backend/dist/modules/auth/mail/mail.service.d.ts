import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailer;
    constructor(mailer: MailerService);
    sendTestEmail(to: string): Promise<void>;
    sendVerifyEmail(to: string, token: string): Promise<void>;
    sendResetPassword(to: string, token: string): Promise<void>;
}
