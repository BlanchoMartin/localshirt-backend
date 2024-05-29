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
const configuration_1 = require("./../config/configuration");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("./mail.service");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
        ],
        providers: [
            config_1.ConfigService,
            {
                provide: mail_service_1.MailService,
                useFactory: async (configService) => {
                    const smtpConfig = {
                        service: configService.get('SMTP_SERVICE'),
                        auth: {
                            user: configService.get('SMTP_USERNAME'),
                            pass: configService.get('SMTP_PASSWORD'),
                        },
                    };
                    const mailerService = new mail_service_1.MailService(smtpConfig);
                    await mailerService.initialize();
                    return mailerService;
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [mail_service_1.MailService],
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map