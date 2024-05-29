"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeShein = void 0;
const scraper_service_1 = require("../scraper.service");
const article_web_model_1 = require("../../article/web/article.web.model");
async function ScrapeShein(url) {
    const scrapedArticleData = new article_web_model_1.ArticleWebObject();
    const browser = await scraper_service_1.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    try {
        await page.waitForSelector('#goods-detail-v3', {
            visible: true,
            timeout: 10000,
        });
    }
    catch (error) {
        console.error("Div with ID not found:", error);
    }
    const html = await page.content();
    const $ = scraper_service_1.cheerio.load(html);
    const priceRegex = /([0-9]+(\.[0-9]{2})?)/;
    const name = $('.product-intro__head-name').text();
    try {
        await page.waitForSelector('span.price-estimated-percent__price', {
            visible: true,
            timeout: 10000,
        });
    }
    catch (error) {
    }
    let price = $('span.price-estimated-percent__price').text().trim();
    if (price == "") {
        try {
            await page.waitForSelector('.product-intro__head-mainprice', {
                visible: true,
                timeout: 10000,
            });
        }
        catch (error) {
        }
        price = $('.product-intro__head-mainprice').text().trim();
        console.log(price, price == "");
        const matchedPrice = price.match(priceRegex);
        if (matchedPrice && matchedPrice[0]) {
            price = matchedPrice[0];
        }
        else {
            price = "";
        }
    }
    const ID = $('.product-intro__head-sku').text().split('SKU: ')[1];
    const description = $('.product-intro__description-table');
    const descriptionContentArray = [];
    description.find('> div').each((index, element) => {
        const childText = $(element).text();
        descriptionContentArray.push(childText);
    });
    await page.goto('https://fr.shein.com/environmental');
    await page.type('.sui-input__inner.sui-input__inner-suffix', ID);
    await page.click('.sui-button-common.sui-button-common__primary.sui-button-common__H54PX.btn');
    try {
        await page.waitForSelector('.result-list', {
            timeout: 20000,
        });
    }
    catch (error) {
    }
    const origin = await page.$$eval('.result-right ul li', (liElements) => {
        return liElements.map((li) => {
            const [firstP, secondP] = li.querySelectorAll('p');
            return [firstP.textContent.trim(), secondP.textContent.trim()];
        });
    });
    await browser.close();
    scrapedArticleData.name = name;
    scrapedArticleData.url = url;
    scrapedArticleData.image = '';
    scrapedArticleData.brand = 'Shein';
    scrapedArticleData.price = parseFloat(price.replace(',', '.'));
    scrapedArticleData.country = origin
        .map((innerArray) => innerArray[1])
        .map((country) => ({ name: country }));
    scrapedArticleData.material = (0, scraper_service_1.findMatchingMaterials)(descriptionContentArray.join(' '));
    scrapedArticleData.transport = [];
    const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
    console.log(articleJsonString);
    return scrapedArticleData;
}
exports.ScrapeShein = ScrapeShein;
//# sourceMappingURL=ScrapShein.js.map