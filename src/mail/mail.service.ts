import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private readonly smtpConfig: any) {}

  async initialize() {
    this.transporter = createTransport(this.smtpConfig);
    await this.transporter.verify();
  }

  async sendMail(to: string, subject: string, text: string, from: string = 'localshirt.eip@gmail.com') {
    console.log(from);
    const mailOptions = {
      from: from,
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendMailWithTemplate(
    to: string,
    subject: string,
    templateName: string,
    templateData: Record<string, any>,
    from: string = 'localshirt.eip@gmail.com',
  ) {
    const templatePath = `./templates/${templateName}.hbs`;
    const readFile = promisify(fs.readFile);
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
}