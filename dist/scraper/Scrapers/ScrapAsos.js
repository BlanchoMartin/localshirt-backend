"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeAsos = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
async function ScrapeAsos(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const response = await scraper_service_1.axios.get(url);
    const $ = scraper_service_1.cheerio.load(response.data);
    const name = $('.jcdpl').text();
    const price = $('.ky6t2').text();
    const description = [];
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
exports.ScrapeAsos = ScrapeAsos;
//# sourceMappingURL=ScrapAsos.js.map