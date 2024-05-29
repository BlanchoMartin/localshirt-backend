import {
  clothingColorList,
  clothingTypeList,
  colorsArrayToRGB,
  findMatchingMaterials,
  findSimilarWords,
  puppeteer,
} from '../scraper.service';
import {ArticleWebObject} from "../../article/web/article.web.model";

export async function ScrapeBoohoo(url: string): Promise<ArticleWebObject> {
  const scrapedArticleData: ArticleWebObject = new ArticleWebObject();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  try {
      await page.waitForSelector('div.l-pdp-main', {
        visible: true,
        timeout: 30000,
      });
      const name = await page.$eval(
        'h1.b-product_details-name',
        (element) => element.textContent.trim(),
      );
      const price = await page.$eval(
        'span.b-price-item.m-new',
        (element) => element.textContent,
      );
      const description = await page.$eval('div.b-product_details-content', (element) =>
        element.textContent.trim(),
      );
      const color = await page.$eval('span.b-variation_label-value', (element) =>
        element.textContent.trim(),
      );

      await browser.close();  
      scrapedArticleData.name = name;
      scrapedArticleData.url = url;
      scrapedArticleData.image = '';
      scrapedArticleData.brand = 'Boohoo';
      scrapedArticleData.price = parseFloat(price.replace(',', '.'));
      scrapedArticleData.country = [];
      scrapedArticleData.material = findMatchingMaterials(description);
      scrapedArticleData.transport = [];
      const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
      console.log(articleJsonString);
  } catch (error) {
      console.error('Error:', error);
  }
  return scrapedArticleData;
}
