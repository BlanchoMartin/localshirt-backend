import { ArticleWebService } from './article.web.service';
import { ArticleWebResponse, CountryInput, MaterialInput, TransportInput } from './article.web.model';
import { ArticleWeb } from "../../database/entities/article.web.entity";
export declare class ArticleWebResolver {
    private articleWebService;
    constructor(articleWebService: ArticleWebService);
    createArticleWeb(name: string, url: string, brand: string, country: CountryInput[], material: MaterialInput[], transport: TransportInput[], price: number, image: string): Promise<ArticleWebResponse>;
    updateArticleWebById(id: string, name: string, url: string, brand: string, country: CountryInput[], material: MaterialInput[], transport: TransportInput[], price: number, image: string): Promise<ArticleWebResponse>;
    deleteArticleWebById(id: string): Promise<ArticleWebResponse>;
    isArticleUrlAlreadyParsed(url: string): Promise<ArticleWeb>;
}
