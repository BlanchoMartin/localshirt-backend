"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeVeja = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
async function ScrapeVeja(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const response = await scraper_service_1.axios.get(url);
    const $ = scraper_service_1.cheerio.load(response.data);
    const name = $("span.base[itemprop='name']").text().trim();
    const price = $('span.price').text().trim();
    const size = $('.swatch-attribute-selected-option').html();
    const descriptionProduit = $('.product.attribute.description');
    const descriptionProduitHTML = descriptionProduit.html();
    const descriptionLines = descriptionProduitHTML.split('<br>');
    const descriptionData = {};
    descriptionLines.forEach((line) => {
        const keyValue = line.split(':');
        if (keyValue.length === 2) {
            const key = keyValue[0].trim().replace(/<[^>]*>/g, '');
            const value = keyValue[1].trim().replace(/<[^>]*>/g, '');
            descriptionData[key] = value;
        }
        else {
            const temp = keyValue[0].trim().replace(/<[^>]*>/g, '');
            descriptionData[temp] = temp;
        }
    });
    let origin = 'Brézil';
    for (const key in descriptionData) {
        if (descriptionData.hasOwnProperty(key)) {
            const value = descriptionData[key];
            if (value.startsWith('Fabriqué au ')) {
                origin = value.substring('Fabriqué au '.length);
            }
        }
    }
    const descrptionDataStr = Object.entries(descriptionData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    scrapedArticleData.name = name;
    scrapedArticleData.url = url;
    scrapedArticleData.image = '';
    scrapedArticleData.brand = 'Veja';
    scrapedArticleData.price = parseFloat(price.replace(',', '.'));
    scrapedArticleData.country = [{ name: origin }];
    scrapedArticleData.material = (0, scraper_service_1.findMatchingMaterials)(descrptionDataStr);
    scrapedArticleData.transport = [];
    const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
    console.log(articleJsonString);
    return scrapedArticleData;
}
exports.ScrapeVeja = ScrapeVeja;
//# sourceMappingURL=ScrapVeja.js.map