import {
    puppeteer,
  } from '../scraper.service';
import {ArticleWebObject} from "../../article/web/article.web.model";
  
  export async function ScrapDefault(url: string): Promise<ArticleWebObject> {
    const scrapedArticleData: ArticleWebObject = new ArticleWebObject();
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    console.log(await page.content());
    try {
    } catch (error) {
        console.error('Error:', error);
    }
  
    return scrapedArticleData;
  }
  