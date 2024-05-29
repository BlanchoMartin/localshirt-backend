import {
  clothingColorList,
  clothingTypeList,
  colorsArrayToRGB,
  findMatchingMaterials,
  findSimilarWords,
  puppeteer,
} from '../scraper.service';
import {ArticleWebObject} from "../../article/web/article.web.model";

export async function ScrapeFE21(url: string): Promise<ArticleWebObject> {
  const scrapedArticleData: ArticleWebObject = new ArticleWebObject();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  try {
      await page.waitForSelector('div.pdp-main__details', {
        visible: true,
        timeout: 30000,
      });
      const name = await page.$eval(
        'h1.pdp__name',
        (element) => element.textContent.trim(),
      );
      const price = await page.$eval(
        'span.value',
        (element) => element.textContent,
      );
      const description = await page.$eval('div.pdp__details-inner', (element) =>
        element.textContent.trim(),
      );
      const color = await page.$eval('div.product-attribute__head.flex', (element) =>
        element.textContent.trim().replace("\n", " "),
      );

      await browser.close();  
      scrapedArticleData.name = name;
      scrapedArticleData.url = url;
      scrapedArticleData.image = '';
      scrapedArticleData.brand = 'Forever 21';
      scrapedArticleData.price = parseFloat(price.replace(',', '.').replace('$', ''));
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
