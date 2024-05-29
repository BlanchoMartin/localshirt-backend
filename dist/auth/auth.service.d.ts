import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import { Users } from '../database/entities/users.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { AuthResponse, CompaniesListResponse, UserAuthResponse, UserListResponse } from './auth.model';
import { ArticlePartner } from "../database/entities/article.partner.entity";
export declare class AuthService {
    private logger;
    private jwtService;
    private readonly mailService;
    private usersRepository;
    private articlesPartnersRepository;
    constructor(logger: LoggerService, jwtService: JwtService, mailService: MailService, usersRepository: Repository<Users>, articlesPartnersRepository: Repository<ArticlePartner>);
    login(user: any): Promise<AuthResponse>;
    findAll(): Promise<UserListResponse>;
    createUser(body: any, req: any): Promise<AuthResponse>;
    deleteUserConnected(req: any): Promise<AuthResponse>;
    userAskDev(req: any): Promise<AuthResponse>;
    giveDevPermission(email: string): Promise<AuthResponse>;
    deleteByDeveloper(id: string, req: any): Promise<AuthResponse>;
    confirmRegistration(token: string): Promise<AuthResponse>;
    send_email_password(body: any, req: any): Promise<Record<string, any>>;
    updateConnectedUser(body: any, req: any): Promise<Record<string, any>>;
    UpdateUserByAdmin(body: any, req: any): Promise<Record<string, any>>;
    change_password(body: any): Promise<{
        status: HttpStatus;
        content: {
            msg: string;
        };
        devMessage: string;
    }>;
    getUser(user: any): Promise<UserAuthResponse>;
    getCompanies(): Promise<CompaniesListResponse>;
    updateEmailById(req: any, id: string, newEmail: string): Promise<AuthResponse>;
}
