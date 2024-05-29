import { AnalysisService } from './analysis.service';
import { ArticlePartnerListResponse } from '../article/partner/article.partner.model';
export declare class AnalysisResolver {
    private AnalysisService;
    constructor(AnalysisService: AnalysisService);
    findAlternative(URL: string, likeliness: number, minPrice: number, maxPrice: number): Promise<ArticlePartnerListResponse>;
    findAlternativeByImage(image: string, minPrice: number, maxPrice: number, likeliness: number): Promise<ArticlePartnerListResponse>;
}
