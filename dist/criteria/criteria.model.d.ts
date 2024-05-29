import { InputQuestion } from "../question/question.model";
export declare class CriteriaResponse {
    status: number;
    devMessage: string;
}
export declare class CriteriaStruct {
    id: string;
    tag: string;
    type: string;
    ethical_score: number;
    ecological_score: number;
    local_score: number;
}
export declare class CriteriaListResponse {
    status: number;
    devMessage: string;
    criteria: CriteriaStruct[];
}
export declare class AdditionalCriteria {
    result: string;
    question: InputQuestion;
}
