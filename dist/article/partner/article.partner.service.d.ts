import { LoggerService } from '../../logger/logger.service';
import { ArticlePartner } from '../../database/entities/article.partner.entity';
import { ArticlePartnerListResponse, ArticlePartnerResponse } from './article.partner.model';
import { Repository } from 'typeorm';
import { Users } from '../../database/entities/users.entity';
import { Criteria } from '../../database/entities/criteria.entity';
export declare function cleanDetails(content: {
    getObjectDetails: {
        status: number;
        content: string;
    };
}): string;
export declare class ArticlePartnerService {
    private logger;
    private articleRepository;
    private usersRepository;
    private criteriaRepository;
    constructor(logger: LoggerService, articleRepository: Repository<ArticlePartner>, usersRepository: Repository<Users>, criteriaRepository: Repository<Criteria>);
    isNumberOrBoolean(value: string): boolean;
    create(body: any, req: any): Promise<ArticlePartnerResponse>;
    isUUID(str: string): boolean;
    delete(id: string, req: any): Promise<ArticlePartnerResponse>;
    update(id: string, body: any, req: any): Promise<ArticlePartnerResponse>;
    getArticlePublicList(filters: string): Promise<ArticlePartnerListResponse>;
    getArticlesByUserId(req: any): Promise<ArticlePartnerListResponse>;
    updateArticleLastClick(articleId: string): Promise<ArticlePartnerResponse>;
    meetsNumericCondition(fieldValue: any, operator: string, numericValue: number): boolean;
    filterArticlesByCountries(articles: ArticlePartner[], key: string, countryArray: string[], resultArticles: ArticlePartner[]): void;
    getAllArticlesPartner(): Promise<ArticlePartnerListResponse>;
    getArticlePartnerList(filters: {
        name?: string;
        brand?: string;
        country?: string;
        material?: string;
        transport?: string;
        price?: string;
        ethical_score?: string;
        ecological_score?: string;
        local_score?: string;
        type?: string;
        lastbought?: Date;
        lastshown?: Date;
        lastclick?: Date;
    }, req: any): Promise<ArticlePartnerListResponse>;
}
