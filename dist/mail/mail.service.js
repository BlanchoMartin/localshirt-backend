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
const nodemailer_1 = require("nodemailer");
const Handlebars = require("handlebars");
const fs = require("fs");
const util_1 = require("util");
let MailService = class MailService {
    constructor(smtpConfig) {
        this.smtpConfig = smtpConfig;
    }
    async initialize() {
        this.transporter = (0, nodemailer_1.createTransport)(this.smtpConfig);
        await this.transporter.verify();
    }
    async sendMail(to, subject, text, from = 'localshirt.eip@gmail.com') {
        console.log(from);
        const mailOptions = {
            from: from,
            to,
            subject,
            text,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendMailWithTemplate(to, subject, templateName, templateData, from = 'localshirt.eip@gmail.com') {
        const templatePath = `./templates/${templateName}.hbs`;
        const readFile = (0, util_1.promisify)(fs.readFile);
        const emailContent = await readFile(templatePath, 'utf-8');
        const compiledTemplate = Handlebars.compile(emailContent);
        const emailText = compiledTemplate(templateData);
        const mailOptions = {
            from: from,
            to,
            subject,
            html: emailText,
        };
        await this.transporter.sendMail(mailOptions);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], MailService);
//# sourceMappingURL=mail.service.js.map