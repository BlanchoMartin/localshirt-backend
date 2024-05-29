import { LoggerService } from '../logger/logger.service';
import { Repository } from 'typeorm';
import { Criteria } from '../database/entities/criteria.entity';
import { Users } from '../database/entities/users.entity';
import { AdditionalCriteria, CriteriaListResponse, CriteriaResponse } from './criteria.model';
export declare class CriteriaService {
    private logger;
    private criteriaRepository;
    private userRepository;
    constructor(logger: LoggerService, criteriaRepository: Repository<Criteria>, userRepository: Repository<Users>);
    create(body: {
        tag: string;
        type: string;
        additionalCriteria: AdditionalCriteria[];
    }, req: any): Promise<CriteriaResponse>;
    delete(id: string, req: any): Promise<CriteriaResponse>;
    update(id: string, body: any, req: any): Promise<CriteriaResponse>;
    getAllCriteria(): Promise<CriteriaListResponse>;
}
