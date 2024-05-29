"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapDefault = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
async function ScrapDefault(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const browser = await scraper_service_1.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    console.log(await page.content());
    try {
    }
    catch (error) {
        console.error('Error:', error);
    }
    return scrapedArticleData;
}
exports.ScrapDefault = ScrapDefault;
//# sourceMappingURL=ScrapDefault.js.map