"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let MailService = class MailService {
    constructor(mailer) {
        this.mailer = mailer;
    }
    async sendTestEmail(to) {
        try {
            await this.mailer.sendMail({
                to,
                subject: 'Test Email',
                text: 'Hello from NestJS!',
            });
            console.log('✅ Email sent successfully');
        }
        catch (error) {
            console.error('❌ Failed to send email:', error.message);
            throw error;
        }
    }
    async sendVerifyEmail(to, token) {
        const subject = 'Verify your email';
        const text = [
            'Welcome to PersonalBlog!',
            '',
            'Use this token to verify your email:',
            token,
            '',
            'If you did not request this, ignore this email.',
        ].join('\n');
        await this.mailer.sendMail({ to, subject, text });
    }
    ;
    async sendResetPassword(to, token) {
        const subject = 'Reset your password';
        const text = [
            'You requested a password reset.',
            '',
            'Use this token to reset your password:',
            token,
            '',
            'If you did not request this, ignore this email.',
        ].join('\n');
        await this.mailer.sendMail({ to, subject, text });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map