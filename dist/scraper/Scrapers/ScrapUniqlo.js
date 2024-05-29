"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeUniqlo = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
async function ScrapeUniqlo(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const browser = await scraper_service_1.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    try {
        await page.waitForSelector('h1.productvariantcontent__title.js_pdpTitle', {
            visible: true,
            timeout: 10000,
        });
        const name = await page.$eval('h1.productvariantcontent__title.js_pdpTitle', (element) => element.textContent);
        const price = await page.$eval('span.price-sales', (element) => element.textContent);
        const description = await page.$$eval('div.deliverySection__text.textToggle__text.js-toggleText', elements => {
            const temp = [];
            elements.forEach(elem => {
                temp.push(elem.textContent.trim());
            });
            const El1 = temp.join(" ");
            return El1;
        });
        const color = await page.$eval('h6.swatchHeadline.js-color-headline', (element) => element.textContent.trim().replace("\n", " "));
        await browser.close();
        scrapedArticleData.name = name;
        scrapedArticleData.url = url;
        scrapedArticleData.image = '';
        scrapedArticleData.brand = 'Uniqlo';
        scrapedArticleData.price = parseFloat(price.replace(',', '.'));
        scrapedArticleData.country = [];
        scrapedArticleData.material = (0, scraper_service_1.findMatchingMaterials)(description.replace('\t', ' '));
        scrapedArticleData.transport = [];
        const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
        console.log(articleJsonString);
    }
    catch (error) {
        console.error('Error:', error);
    }
    return scrapedArticleData;
}
exports.ScrapeUniqlo = ScrapeUniqlo;
//# sourceMappingURL=ScrapUniqlo.js.map