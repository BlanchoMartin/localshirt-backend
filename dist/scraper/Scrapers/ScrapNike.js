"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeNike = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
async function ScrapeNike(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const priceRegex = /(\d{1,3}(?:,\d{3})*(?:,\d+)?)/;
    const response = await scraper_service_1.axios.get(url);
    const $ = scraper_service_1.cheerio.load(response.data);
    const name = $('#pdp_product_title').text();
    const price = $('[data-test="product-price"]')
        .text()
        .trim()
        .match(priceRegex)[0];
    const detailDuProduit = await scrapDescritpion(url);
    const origin = ['Chine', 'Vietnam'];
    scrapedArticleData.name = name;
    scrapedArticleData.url = url;
    scrapedArticleData.image = '';
    scrapedArticleData.brand = 'Nike';
    scrapedArticleData.price = parseFloat(price.replace(',', '.'));
    scrapedArticleData.country = origin.map((country) => ({ name: country }));
    scrapedArticleData.material = (0, scraper_service_1.findMatchingMaterials)(detailDuProduit.join(' '));
    scrapedArticleData.transport = [];
    const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
    console.log(articleJsonString);
    return scrapedArticleData;
}
exports.ScrapeNike = ScrapeNike;
async function scrapDescritpion(url) {
    const browser = await scraper_service_1.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    try {
        await page.waitForSelector('.ncss-cta-primary-dark.btn-lg.underline.prl0-sm.pb0-sm.readMoreBtn.css-6q6seo', {
            visible: true,
            timeout: 10000,
        });
        await page.click('.ncss-cta-primary-dark.btn-lg.underline.prl0-sm.pb0-sm.readMoreBtn.css-6q6seo');
    }
    catch (error) {
        console.error('Button not found or not clickable:', error);
    }
    await page.waitForSelector('.pi-pdpmainbody');
    const html = await page.content();
    const $ = scraper_service_1.cheerio.load(html);
    const divElement = $('.pi-pdpmainbody');
    const childElements = divElement.children();
    const content = [];
    childElements.each((index, element) => {
        const elementContent = $(element).text().trim();
        if (elementContent !== '') {
            content.push(elementContent);
        }
    });
    content.sort();
    await browser.close();
    return content;
}
//# sourceMappingURL=ScrapNike.js.map