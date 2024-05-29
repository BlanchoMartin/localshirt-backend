import {
  ClothingItem,
  clothingColorList,
  clothingTypeList,
  colorsArrayToRGB,
  findMatchingMaterials,
  findSimilarWords,
  puppeteer,
} from '../scraper.service';
import {ArticleWebObject} from "../../article/web/article.web.model";
import { JSDOM } from 'jsdom';

export async function ScrapeMango(url: string): Promise<ArticleWebObject> {
  const scrapedArticleData: ArticleWebObject = new ArticleWebObject();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  try {
    await page.waitForSelector('.product-features', {
      visible: true,
      timeout: 20000,
    });
    await page.waitForSelector('h1.product-name', {
      visible: true,
      timeout: 20000,
    });
    const name = await page.$eval(
      'h1.product-name',
      (element) => element.textContent,
    );

    await page.waitForSelector('span.sAobE.text-title-xl', {
      visible: true,
      timeout: 10000,
    });
    const price = await page.$eval(
      'span.sAobE.text-title-xl',
      (element) => element.textContent,
    );
    
  
    const [descriptionElement, compositionElement] = await page.$$eval('.product-info-block', elements => {
      const El1 = elements[0]?.textContent.trim(); 
      const El2 = elements[1]?.innerHTML;
  
      return [El1, El2];
    });
    const compositionArr: string[] = [];
    const dom = new JSDOM(compositionElement);
    const otherInfoElements = dom.window.document.querySelectorAll('*');
    otherInfoElements.forEach(element => {
        const textContent = element.textContent.trim();
        if (textContent && !compositionArr.includes(textContent)) {
          compositionArr.push(textContent);
        }
    });
    const originIndex = compositionArr.indexOf("Origine")
    const AfterColonCompositionArr = compositionArr.map(str => {
      const parts: string[] = str.split(':');
      
      const lastSubstring: string = parts[parts.length - 1];
      
      return lastSubstring.trim();
    });

    AfterColonCompositionArr.splice(originIndex, 1)
    const originArr = AfterColonCompositionArr.slice(originIndex - 1)
    originArr[0] = originArr[0].split(' ').pop()
    await browser.close();

    scrapedArticleData.name = name;
    scrapedArticleData.url = url;
    scrapedArticleData.image = '';
    scrapedArticleData.brand = 'Mango';
    scrapedArticleData.price = parseFloat(price.replace(',', '.'));
    scrapedArticleData.country = originArr.map((country) => ({ name: country }));
    scrapedArticleData.material = findMatchingMaterials(compositionArr.join(' '));
    scrapedArticleData.transport = [];

    const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
    console.log(articleJsonString);
  } catch (error) {
    console.error('Error:', error);
  }
  return scrapedArticleData;
}
