export declare class MailService {
    private readonly smtpConfig;
    private transporter;
    constructor(smtpConfig: any);
    initialize(): Promise<void>;
    sendMail(to: string, subject: string, text: string, from?: string): Promise<void>;
    sendMailWithTemplate(to: string, subject: string, templateName: string, templateData: Record<string, any>, from?: string): Promise<void>;
}
