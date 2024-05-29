export declare class QuestionResponse {
    status: number;
    devMessage: string;
}
export declare class Question {
    id: string;
    tag: string;
    content: string;
    criteria_target: string;
    criteria_application: string;
    user_response_type: string;
    factor: number;
    minimize: boolean;
}
export declare class InputQuestion {
    questionId: string;
    criteria_application: string;
    user_response_type: string;
    factor: number;
    minimize: boolean;
}
