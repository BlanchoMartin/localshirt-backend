"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = exports.colorsArrayToRGB = exports.findMatchingMaterials = exports.findSimilarWords = exports.convertImageUrlToBase64 = exports.scrapableSites = exports.puppeteer = exports.cheerio = exports.axios = exports.clothingTypeList = exports.clothingColorList = void 0;
const common_1 = require("@nestjs/common");
const cheerio_1 = require("cheerio");
exports.cheerio = cheerio_1.default;
const puppeteer_1 = require("puppeteer");
exports.puppeteer = puppeteer_1.default;
const axios_1 = require("axios");
exports.axios = axios_1.default;
const request = require('request');
const colorsConstant_1 = require("../constants/colorsConstant");
Object.defineProperty(exports, "clothingColorList", { enumerable: true, get: function () { return colorsConstant_1.clothingColorList; } });
const clothingTypeConstant_1 = require("../constants/clothingTypeConstant");
Object.defineProperty(exports, "clothingTypeList", { enumerable: true, get: function () { return clothingTypeConstant_1.clothingTypeList; } });
const materialsConstant_1 = require("../constants/materialsConstant");
const colorsConstant_2 = require("../constants/colorsConstant");
const RobotTxT_Handler_1 = require("./Scrapers/RobotTxT_Handler");
const ScrapNike_1 = require("./Scrapers/ScrapNike");
const ScrapVeja_1 = require("./Scrapers/ScrapVeja");
const ScrapShein_1 = require("./Scrapers/ScrapShein");
const ScrapAsos_1 = require("./Scrapers/ScrapAsos");
const ScrapMango_1 = require("./Scrapers/ScrapMango");
const ScrapUniqlo_1 = require("./Scrapers/ScrapUniqlo");
const ScrapDefault_1 = require("./Scrapers/ScrapDefault");
const ScrapFE21_1 = require("./Scrapers/ScrapFE21");
const ScrapPrimark_1 = require("./Scrapers/ScrapPrimark");
const ScrapBoohoo_1 = require("./Scrapers/ScrapBoohoo");
exports.scrapableSites = [
    'https://www.nike.com',
    'https://www.veja-store.com',
    'https://m.shein.com',
    'https://fr.shein.com',
    'https://eur.shein.com',
    'https://us.shein.com',
    'https://www.asos.com',
    'https://shop.mango.com',
    'https://www.uniqlo.com',
    'https://www.forever21.com',
    'https://www.primark.com',
    'https://fr.boohoo.com'
];
function convertImageUrlToBase64(url) {
    return new Promise((resolve, reject) => {
        request.get({ url, encoding: null }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            if (response.statusCode !== 200) {
                reject(`Failed to fetch image, status code: ${response.statusCode}`);
                return;
            }
            const base64String = Buffer.from(body).toString('base64');
            resolve(base64String);
        });
    });
}
exports.convertImageUrlToBase64 = convertImageUrlToBase64;
const siteScrapers = {
    'https://www.nike.com': ScrapNike_1.ScrapeNike,
    'https://www.veja-store.com': ScrapVeja_1.ScrapeVeja,
    'https://m.shein.com': ScrapShein_1.ScrapeShein,
    'https://fr.shein.com': ScrapShein_1.ScrapeShein,
    'https://eur.shein.com': ScrapShein_1.ScrapeShein,
    'https://us.shein.com': ScrapShein_1.ScrapeShein,
    'https://www.asos.com': ScrapAsos_1.ScrapeAsos,
    'https://shop.mango.com': ScrapMango_1.ScrapeMango,
    'https://www.uniqlo.com': ScrapUniqlo_1.ScrapeUniqlo,
    'https://www.forever21.com': ScrapFE21_1.ScrapeFE21,
    'https://www.primark.com': ScrapPrimark_1.ScrapePrimark,
    'https://fr.boohoo.com': ScrapBoohoo_1.ScrapeBoohoo,
};
function findSimilarWords(wordList, inputString) {
    const result = [];
    wordList.forEach((word) => {
        const lowercaseWord = word.toLowerCase();
        const lowercaseInput = inputString.toLowerCase();
        if (lowercaseInput.includes(lowercaseWord) ||
            lowercaseWord.includes(lowercaseInput)) {
            result.push(word);
        }
    });
    return result;
}
exports.findSimilarWords = findSimilarWords;
function findMatchingMaterials(inputString) {
    const result = [];
    materialsConstant_1.materialList.forEach((material) => {
        const lowercaseMaterial = material.toLowerCase();
        const lowercaseInput = inputString.toLowerCase();
        if (lowercaseInput.includes(lowercaseMaterial) ||
            lowercaseMaterial.includes(lowercaseInput)) {
            result.push({ name: material, percent: 100 });
        }
    });
    if (result.length === 0) {
        result.push({ name: inputString, percent: 100 });
    }
    return result;
}
exports.findMatchingMaterials = findMatchingMaterials;
function colorsArrayToRGB(colors) {
    const totalColors = colors.length;
    const percent = totalColors > 0 ? 100 / totalColors : 0;
    const colorArray = colors.map((color) => {
        const lowerCaseColor = color.toLowerCase();
        if (colorsConstant_2.colorMap.hasOwnProperty(lowerCaseColor)) {
            return { rgb: colorsConstant_2.colorMap[lowerCaseColor], percent };
        }
        return null;
    });
    if (colorArray.length == 0)
        return null;
    return colorArray;
}
exports.colorsArrayToRGB = colorsArrayToRGB;
const userAgent = 'LocalShirtScraper (+localshirt_2025@labeip.epitech.eu)';
let ScraperService = class ScraperService {
    async CheckRobot(url, siteIndex) {
        const isAllowed = await (0, RobotTxT_Handler_1.IsPathAllowed)(exports.scrapableSites[siteIndex], userAgent, url);
        if (isAllowed) {
            console.log('All good, have fun crawling');
            return true;
        }
        else {
            console.error(`Crawling ${url} is not allowed according to the site's robots.txt`);
            return false;
        }
    }
    getSimilarSiteIndex(url) {
        for (let i = 0; i < exports.scrapableSites.length; i++) {
            if (url.includes(exports.scrapableSites[i])) {
                return i;
            }
        }
        return -1;
    }
    async ScrapeSite(url) {
        const siteIndex = this.getSimilarSiteIndex(url);
        if (siteIndex === -1) {
            console.error('\nError with site\n');
            return null;
        }
        if (siteIndex != 8) {
            if (!(await this.CheckRobot(url, siteIndex))) {
                return;
            }
            const crawlDelay = await (0, RobotTxT_Handler_1.GetCrawlDelay)(exports.scrapableSites[siteIndex], userAgent);
            if (crawlDelay !== undefined) {
                await new Promise((resolve) => setTimeout(resolve, crawlDelay * 1000));
            }
        }
        let article;
        const scrapeFunction = siteScrapers[exports.scrapableSites[siteIndex]];
        if (scrapeFunction) {
            article = await scrapeFunction(url);
        }
        else {
            await (0, ScrapDefault_1.ScrapDefault)(url);
            console.error("\nThere was an error with the site, can't find scraper for it");
        }
        console.log('\n\nDONE - SCRAPED\n\n');
        return article;
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = __decorate([
    (0, common_1.Injectable)()
], ScraperService);
//# sourceMappingURL=scraper.service.js.map