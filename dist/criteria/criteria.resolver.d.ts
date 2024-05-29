import { CriteriaService } from './criteria.service';
import { AdditionalCriteria, CriteriaListResponse, CriteriaResponse } from "./criteria.model";
export declare class CriteriaResolver {
    private criteriaService;
    constructor(criteriaService: CriteriaService);
    createCriteria(tag: string, type: string, additionalCriteria: AdditionalCriteria[], context: any): Promise<CriteriaResponse>;
    deleteCriteria(id: string, context: any): Promise<CriteriaResponse>;
    updateCriteria(id: string, tag: string, production: boolean, end_life: boolean, independent_chemical: boolean, natural: boolean, life_duration: number, life_cycle: boolean, animals: boolean, context: any): Promise<CriteriaResponse>;
    getAllCriteria(context: any): Promise<CriteriaListResponse>;
}
