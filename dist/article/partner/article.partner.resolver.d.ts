import { ArticlePartnerService } from './article.partner.service';
import { ArticlePartnerResponse, ArticlePartnerListResponse, TransportInputType } from './article.partner.model';
import { AdditionalCriteria } from "../../criteria/criteria.model";
import { CriteriaInputType } from './article.partner.model';
export declare class ArticlePartnerResolver {
    private articlePartnerService;
    constructor(articlePartnerService: ArticlePartnerService);
    createArticlePartner(name: string, redirection_url: string, material: CriteriaInputType[], country: CriteriaInputType[], transport: TransportInputType[], price: number, image: string, description: string, environnementdesc: string, ethicaldesc: string, additionalCriteria: AdditionalCriteria[], context: any): Promise<ArticlePartnerResponse>;
    deleteArticlePartner(id: string, context: any): Promise<ArticlePartnerResponse>;
    updateArticlePartner(id: string, name: string, country: string, material: string, transport: string, price: string, image: string, brandlogo: string, description: string, branddesc: string, environnementdesc: string, ethicaldesc: string, type: string, lastbought: Date, lastshown: Date, lastclick: Date, context: any): Promise<ArticlePartnerResponse>;
    updateArticlePartnerAdmin(id: string, name: string, brand: string, country: string, material: string, transport: string, price: string, brandlogo: string, description: string, branddesc: string, environnementdesc: string, ethicaldesc: string, type: string, lastbought: String, lastshown: String, lastclick: String, context: any): Promise<ArticlePartnerResponse>;
    getArticlePartnerList(name: string, brand: string, country: string, material: string, transport: string, price: string, ethical_score: string, ecological_score: string, local_score: string, type: string, lastbought: Date, lastshown: Date, lastclick: Date, context: any): Promise<ArticlePartnerListResponse>;
    getArticlePartnerUserList(context: any): Promise<ArticlePartnerListResponse>;
    getAllArticlesPartner(context: any): Promise<ArticlePartnerListResponse>;
    updateArticleLastClick(context: any, articleId: string): Promise<ArticlePartnerResponse>;
}
