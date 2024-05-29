import { QuestionService } from './question.service';
import { Question, QuestionResponse } from './question.model';
export declare class QuestionResolver {
    private questionService;
    constructor(questionService: QuestionService);
    createQuestion(tag: string, content: string, criteria_target: string, criteria_application: string, user_response_type: string, factor: number, minimize: boolean, context: any): Promise<Record<string, any>>;
    updateQuestionById(id: string, tag: string, content: string, criteria_target: string, criteria_application: string, user_response_type: string, factor: number, minimize: boolean, context: any): Promise<Record<string, any>>;
    updateQuestionByTag(tag: string, content: string, criteria_target: string, criteria_application: string, user_response_type: string, factor: number, minimize: boolean, context: any): Promise<Record<string, any>>;
    deleteQuestion(id: string, context: any): Promise<Record<string, any>>;
    getQuestionByTag(tag: string, context: any): Promise<QuestionResponse>;
    getAllQuestions(context: any): Promise<Question[]>;
}
