"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapePrimark = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
async function ScrapePrimark(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const browser = await scraper_service_1.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    try {
        await page.waitForSelector('div.MuiContainer-root', {
            timeout: 10000,
        });
        const name = await page.evaluate(() => {
            const element = document.querySelector('[data-testautomation-id="product-title"]');
            return element ? element.textContent.trim() : null;
        });
        const price = await page.evaluate(() => {
            const element = document.querySelector('[data-testautomation-id="product-price"]');
            return element ? element.textContent.trim() : null;
        });
        const description = await page.evaluate(() => {
            const element = document.querySelector('[data-testautomation-id="accordion"]');
            return element ? element.textContent.trim() : null;
        });
        const imageUrl = await page.$eval('.MuiBox-root.jss248 img', (img) => {
            return img.src;
        });
        const image = await (0, scraper_service_1.convertImageUrlToBase64)(imageUrl)
            .then(base64String => {
            console.log('Base64 string:', base64String);
            return base64String;
        })
            .catch(error => {
            console.error('Error converting image URL to Base64:', error);
        });
        await browser.close();
        scrapedArticleData.name = name;
        scrapedArticleData.url = url;
        scrapedArticleData.image = image ? image : '';
        scrapedArticleData.brand = 'Primark';
        scrapedArticleData.price = parseFloat(price.replace(',', '.'));
        scrapedArticleData.country = [];
        scrapedArticleData.material = (0, scraper_service_1.findMatchingMaterials)(description);
        scrapedArticleData.transport = [];
        const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
        console.log(articleJsonString);
    }
    catch (error) {
        console.error('Error:', error);
    }
    return scrapedArticleData;
}
exports.ScrapePrimark = ScrapePrimark;
//# sourceMappingURL=ScrapPrimark.js.map