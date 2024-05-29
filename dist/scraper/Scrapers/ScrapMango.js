"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeMango = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
const jsdom_1 = require("jsdom");
async function ScrapeMango(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const browser = await scraper_service_1.puppeteer.launch();
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
        const name = await page.$eval('h1.product-name', (element) => element.textContent);
        await page.waitForSelector('span.sAobE.text-title-xl', {
            visible: true,
            timeout: 10000,
        });
        const price = await page.$eval('span.sAobE.text-title-xl', (element) => element.textContent);
        const [descriptionElement, compositionElement] = await page.$$eval('.product-info-block', elements => {
            var _a, _b;
            const El1 = (_a = elements[0]) === null || _a === void 0 ? void 0 : _a.textContent.trim();
            const El2 = (_b = elements[1]) === null || _b === void 0 ? void 0 : _b.innerHTML;
            return [El1, El2];
        });
        const compositionArr = [];
        const dom = new jsdom_1.JSDOM(compositionElement);
        const otherInfoElements = dom.window.document.querySelectorAll('*');
        otherInfoElements.forEach(element => {
            const textContent = element.textContent.trim();
            if (textContent && !compositionArr.includes(textContent)) {
                compositionArr.push(textContent);
            }
        });
        const originIndex = compositionArr.indexOf("Origine");
        const AfterColonCompositionArr = compositionArr.map(str => {
            const parts = str.split(':');
            const lastSubstring = parts[parts.length - 1];
            return lastSubstring.trim();
        });
        AfterColonCompositionArr.splice(originIndex, 1);
        const originArr = AfterColonCompositionArr.slice(originIndex - 1);
        originArr[0] = originArr[0].split(' ').pop();
        await browser.close();
        scrapedArticleData.name = name;
        scrapedArticleData.url = url;
        scrapedArticleData.image = '';
        scrapedArticleData.brand = 'Mango';
        scrapedArticleData.price = parseFloat(price.replace(',', '.'));
        scrapedArticleData.country = originArr.map((country) => ({ name: country }));
        scrapedArticleData.material = (0, scraper_service_1.findMatchingMaterials)(compositionArr.join(' '));
        scrapedArticleData.transport = [];
        const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
        console.log(articleJsonString);
    }
    catch (error) {
        console.error('Error:', error);
    }
    return scrapedArticleData;
}
exports.ScrapeMango = ScrapeMango;
//# sourceMappingURL=ScrapMango.js.map