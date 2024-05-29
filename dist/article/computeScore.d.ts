import { Repository } from 'typeorm';
import { Criteria } from '../database/entities/criteria.entity';
export declare enum ScoreApplication {
    ECOLOGICAL = "ecological",
    ETHICAL = "ethical"
}
export declare function reComputeCriteria(criteriaRepository: any): Promise<void>;
export declare function computeScore(newCriteria: Criteria, application: ScoreApplication, criteriaRepository: Repository<Criteria>): Promise<{
    score: number;
    needToRecomputeOther: boolean;
}>;
