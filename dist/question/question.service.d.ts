import { LoggerService } from '../logger/logger.service';
import { Repository } from 'typeorm';
import { Question } from '../database/entities/question.entity';
import { Users } from '../database/entities/users.entity';
import { QuestionResponse } from "./question.model";
export declare class QuestionService {
    private logger;
    private questionRepository;
    private usersRepository;
    constructor(logger: LoggerService, questionRepository: Repository<Question>, usersRepository: Repository<Users>);
    create(body: {
        tag: string;
        content: string;
        criteria_target: string;
        criteria_application: string;
        user_response_type: string;
        factor: number;
        minimize: boolean;
    }, req: any): Promise<Record<string, any>>;
    updateById(body: {
        id: string;
        tag: string;
        content: string;
        criteria_target: string;
        criteria_application: string;
        user_response_type: string;
        factor: number;
        minimize: boolean;
    }, req: any): Promise<Record<string, any>>;
    updateByTag(body: {
        tag: string;
        content: string;
        criteria_target: string;
        criteria_application: string;
        user_response_type: string;
        factor: number;
        minimize: boolean;
    }, req: any): Promise<Record<string, any>>;
    deleteById(id: string, req: any): Promise<Record<string, any>>;
    getByTag(tag: string, req: any): Promise<QuestionResponse>;
    getAll(req: any): Promise<Question[]>;
}
