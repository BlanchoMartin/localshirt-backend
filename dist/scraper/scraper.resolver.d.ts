import { ScraperService } from './scraper.service';
export declare class ScraperResolver {
    private scraperService;
    constructor(scraperService: ScraperService);
    scraper(url: string): Promise<import("../article/web/article.web.model").ArticleWebObject>;
}
