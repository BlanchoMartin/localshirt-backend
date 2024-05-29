import {
  clothingColorList,
  clothingTypeList,
  colorsArrayToRGB,
  findMatchingMaterials,
  findSimilarWords,
  puppeteer,
} from '../scraper.service';
import {ArticleWebObject} from "../../article/web/article.web.model";

export async function ScrapeUniqlo(url: string): Promise<ArticleWebObject> {
  const scrapedArticleData: ArticleWebObject = new ArticleWebObject();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  try {
    await page.waitForSelector('h1.productvariantcontent__title.js_pdpTitle', {
      visible: true,
      timeout: 10000,
    });
    const name = await page.$eval(
      'h1.productvariantcontent__title.js_pdpTitle',
      (element) => element.textContent,
    );
    const price = await page.$eval(
      'span.price-sales',
      (element) => element.textContent,
    );
    const description = await page.$$eval('div.deliverySection__text.textToggle__text.js-toggleText', elements => {
      const temp: string[] = [];
      elements.forEach(elem => {
        temp.push(elem.textContent.trim())
      });
      const El1 = temp.join(" ")
      return El1;
    });

    const color = await page.$eval('h6.swatchHeadline.js-color-headline', (element) =>
      element.textContent.trim().replace("\n", " "),
    );
    await browser.close();

    scrapedArticleData.name = name;
    scrapedArticleData.url = url;
    scrapedArticleData.image = '';
    scrapedArticleData.brand = 'Uniqlo';
    scrapedArticleData.price = parseFloat(price.replace(',', '.'));
    scrapedArticleData.country = [];
    scrapedArticleData.material = findMatchingMaterials(
      description.replace('\t', ' '),
    );
    scrapedArticleData.transport = [];

    const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
    console.log(articleJsonString);
  } catch (error) {
    console.error('Error:', error);
  }

  return scrapedArticleData;
}
