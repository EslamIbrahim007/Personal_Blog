"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("./mail.service");
const mail_controller_1 = require("./mail.controller");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const host = config.get('SMTP_HOST');
                    const port = Number(config.get('SMTP_PORT') ?? '587');
                    const user = config.get('SMTP_USER');
                    const pass = config.get('SMTP_PASS');
                    const from = config.get('MAIL_FROM');
                    console.log('📧 SMTP Config:', { host, port, user: user?.slice(0, 5) + '...' });
                    const secure = port === 465;
                    return {
                        transport: {
                            host,
                            port,
                            secure,
                            auth: user && pass ? { user, pass } : undefined,
                            tls: {
                                rejectUnauthorized: false,
                                minVersion: 'TLSv1.2',
                                ciphers: 'SSLv3',
                            },
                            connectionTimeout: 20000,
                            greetingTimeout: 20000,
                            socketTimeout: 20000,
                            requireTLS: true,
                        },
                        defaults: {
                            from,
                        },
                    };
                },
            }),
        ],
        controllers: [mail_controller_1.MailController],
        providers: [mail_service_1.MailService],
        exports: [mail_service_1.MailService],
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map