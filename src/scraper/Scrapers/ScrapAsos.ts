import { axios, cheerio } from '../scraper.service';
import {ArticleWebObject} from "../../article/web/article.web.model";

export async function ScrapeAsos(url: string): Promise<ArticleWebObject> {
  const scrapedArticleData: ArticleWebObject = new ArticleWebObject();
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const name = $('.jcdpl').text();
  const price = $('.ky6t2').text();

  const description: string[] = [];
  const divWithClass = $('.F_yfF')
    .find('ul')
    .find('li')
    .each((index, element) => {
      const liContent = $(element).text();
      description.push(liContent);
    });

  const productCode = $('.Jk9Oz').text();
  const size = $('.F_yfF').text();
  return scrapedArticleData;
}
