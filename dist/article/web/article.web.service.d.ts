import { LoggerService } from '../../logger/logger.service';
import { Repository } from 'typeorm';
import { Criteria } from '../../database/entities/criteria.entity';
import { ArticleWeb } from '../../database/entities/article.web.entity';
import { ArticleWebDTO } from './dto/article.web.dto';
import { ArticleWebResponse, CountryInput, MaterialInput, TransportInput } from './article.web.model';
export declare class ArticleWebService {
    private logger;
    private articleWebRepository;
    private criteriaRepository;
    constructor(logger: LoggerService, articleWebRepository: Repository<ArticleWeb>, criteriaRepository: Repository<Criteria>);
    deleteExpiredArticleWeb(): Promise<void>;
    createArticleFromDTO(articleWebDTO: ArticleWebDTO): Promise<ArticleWeb>;
    checkDTO(body: {
        name: string;
        url: string;
        brand: string;
        country: CountryInput[];
        material: MaterialInput[];
        transport: TransportInput[];
        price: number;
        image: string;
    }, articleWebDTO: ArticleWebDTO): Promise<boolean>;
    create(body: {
        name: string;
        url: string;
        brand: string;
        country: CountryInput[];
        material: MaterialInput[];
        transport: TransportInput[];
        price: number;
        image: string;
    }): Promise<ArticleWebResponse>;
    deleteOlder(): Promise<void>;
    deleteById(id: string): Promise<ArticleWebResponse>;
    updateById(body: {
        id: string;
        name: string;
        url: string;
        brand: string;
        country: CountryInput[];
        material: MaterialInput[];
        transport: TransportInput[];
        price: number;
        image: string;
    }): Promise<ArticleWebResponse>;
    isArticleUrlAlreadyParsed(url: string): Promise<ArticleWeb>;
}
