"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AnalysisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const article_partner_entity_1 = require("../database/entities/article.partner.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scraper_service_1 = require("../scraper/scraper.service");
const article_partner_service_1 = require("../article/partner/article.partner.service");
const users_entity_1 = require("../database/entities/users.entity");
const path = require("path");
const fs_1 = require("fs");
const article_web_service_1 = require("../article/web/article.web.service");
const article_web_entity_1 = require("../database/entities/article.web.entity");
const graphqlApollo_1 = require("../graphqlApollo");
let AnalysisService = AnalysisService_1 = class AnalysisService {
    constructor(articleRepository, articleWebRepository, scraperService, ArticleService, ArticleWebService, usersRepository) {
        this.articleRepository = articleRepository;
        this.articleWebRepository = articleWebRepository;
        this.scraperService = scraperService;
        this.ArticleService = ArticleService;
        this.ArticleWebService = ArticleWebService;
        this.usersRepository = usersRepository;
    }
    static computeRectangleArea(points) {
        if (points.length != 4)
            return -1;
        return (points[0].x * points[1].y - points[1].x * points[0].y + (points[1].x * points[2].y - points[2].x * points[1].y) + (points[2].x * points[3].y - points[3].x * points[2].y) + (points[3].x * points[0].y - points[0].x * points[3].y));
    }
    static getIntersectionAreaVertices(rect1, rect2) {
        if (rect1.length != 4 || rect2.length != 4)
            return -1;
        if (rect1[1].x <= rect2[0].x || rect1[3].y <= rect2[0].y || rect1[0].x >= rect2[1].x || rect1[0].y >= rect2[3].y)
            return 0;
        const xArr = [rect1[0].x, rect1[1].x, rect2[0].x, rect2[1].x].sort();
        const yArr = [rect1[0].y, rect1[3].y, rect2[0].y, rect2[3].y].sort();
        const res = [];
        res.push({ x: xArr[1], y: yArr[1] });
        res.push({ x: xArr[2], y: yArr[1] });
        res.push({ x: xArr[2], y: yArr[2] });
        res.push({ x: xArr[1], y: yArr[2] });
        return this.computeRectangleArea(res);
    }
    static convertArticlePartnerListToArticlePartnerStructList(article) {
        return article.map(article => {
            return Object.assign(Object.assign({}, article), { image: article.image.toString('utf-8'), brandlogo: article.brandlogo.toString('utf-8'), country: JSON.parse(article.country), transport: JSON.parse(article.transport), material: JSON.parse(article.material), type: article.type, lastbought: article.lastbought, lastshown: article.lastshown, lastclick: article.lastclick });
        });
    }
    static orderBySharedArea(articleWeb, articlesPartner) {
        let maxAreaSum = 0;
        const articlePartnerArraySorted = [];
        let imageData = null;
        let imageDataContent = null;
        try {
            imageData = JSON.parse(articleWeb.image_data);
            imageDataContent = JSON.parse(imageData.details.getObjectDetails.content);
        }
        catch (err) {
            console.error(err.message);
            return [];
        }
        imageDataContent.forEach(webArticleDetail => {
            if (webArticleDetail == null)
                return;
            const areaRect = AnalysisService_1.computeRectangleArea(webArticleDetail.boundingPoly.normalizedVertices);
            if (areaRect > 0)
                maxAreaSum += areaRect;
        });
        articlesPartner.forEach(articlePartner => {
            let areaSum = 0;
            let imagePartnerData = null;
            let imagePartnerDataContent = null;
            try {
                imagePartnerData = JSON.parse(articlePartner.image_data);
                imagePartnerDataContent = JSON.parse(imagePartnerData.details.getObjectDetails.content);
            }
            catch (err) {
                return [];
            }
            imagePartnerDataContent.forEach(articlePartnerDetail => {
                if (!articlePartnerDetail)
                    return [];
                imageDataContent.forEach(webArticleDetail => {
                    if (webArticleDetail == null)
                        return;
                    const area = AnalysisService_1.getIntersectionAreaVertices(articlePartnerDetail.boundingPoly.normalizedVertices, webArticleDetail.boundingPoly.normalizedVertices);
                    areaSum += area;
                });
            });
            if (areaSum > maxAreaSum)
                areaSum = 0;
            let i = 0;
            while (i < articlePartnerArraySorted.length && articlePartnerArraySorted[i].areaSum >= areaSum)
                i++;
            articlePartnerArraySorted.splice(i, 0, { article: articlePartner, areaSum: areaSum });
        });
        return this.convertArticlePartnerListToArticlePartnerStructList(articlePartnerArraySorted.map(article => article.article));
    }
    static orderByAmountOfDetails(articleWeb, articlePartner) {
        let maxAreaSum = 0;
        const articlePartnerArraySorted = [];
        let imageData = null;
        let imageDataContent = null;
        try {
            imageData = JSON.parse(articleWeb.image_data);
            imageDataContent = JSON.parse(imageData.details.getObjectDetails.content);
        }
        catch (err) {
            console.error(err.message);
            return [];
        }
        imageDataContent.forEach(webArticleDetail => {
            if (webArticleDetail == null)
                return;
            maxAreaSum += AnalysisService_1.computeRectangleArea(webArticleDetail.boundingPoly.normalizedVertices);
        });
        articlePartner.forEach(articlePartner => {
            let areaSum = 0;
            let imageDataPartner = null;
            let imageDataContentPartner = null;
            try {
                imageDataPartner = JSON.parse(articlePartner.image_data);
                imageDataContentPartner = JSON.parse(imageDataPartner.details.getObjectDetails.content);
            }
            catch (err) {
                console.error(err.message);
                return [];
            }
            imageDataContentPartner.forEach(articlePartnerDetail => {
                if (!articlePartnerDetail)
                    return [];
                areaSum += this.computeRectangleArea(articlePartnerDetail.boundingPoly.normalizedVertices);
            });
            let i = 0;
            while (i < articlePartnerArraySorted.length && articlePartnerArraySorted[i].areaSumDiff <= Math.abs(maxAreaSum - areaSum))
                i++;
            articlePartnerArraySorted.splice(i, 0, {
                article: articlePartner,
                areaSumDiff: Math.abs(maxAreaSum - areaSum)
            });
        });
        return this.convertArticlePartnerListToArticlePartnerStructList(articlePartnerArraySorted.map(article => article.article));
    }
    static computeRgbDistance(color1, color2) {
        if (color1.length != 3 || color2.length != 3)
            return -1;
        const squaredDistance = color1.reduce((acc, val, index) => {
            const diff = val - color2[index];
            return acc + diff * diff;
        }, 0);
        return Math.sqrt(squaredDistance);
    }
    static orderByColor(articleWeb, articlePartner, colorThreshold) {
        const articlePartnerArraySorted = [];
        articlePartner.forEach(article => {
            const distance = this.computeRgbDistance(articleWeb.rgb, article.rgb);
            if (distance > colorThreshold)
                return;
            let i = 0;
            while (i < articlePartnerArraySorted.length && articlePartnerArraySorted[i].distance <= distance)
                i++;
            articlePartnerArraySorted.splice(i, 0, { article: article, distance: distance });
        });
        return this.convertArticlePartnerListToArticlePartnerStructList(articlePartnerArraySorted.map(article => article.article));
    }
    async getAllArticle(minPrice, maxPrice) {
        return await this.ArticleService.getAllArticlesPartner().then((articles) => {
            if (minPrice >= 0 && maxPrice > minPrice)
                articles.articles = articles.articles.filter((article) => article.price >= minPrice && article.price <= maxPrice);
            return articles.articles;
        });
    }
    async findAlternativebyImage(image, minPrice, maxPrice, likeliness) {
        const article = new article_partner_entity_1.ArticlePartner();
        const cleanDetails = (content) => {
            const oldContent = JSON.parse(content.getObjectDetails.content);
            const newContent = [];
            oldContent.map(elem => {
                const isPresent = newContent.find(elem2 => elem2.description == elem.description);
                if (isPresent)
                    return;
                newContent.push(elem);
            });
            return JSON.stringify(newContent);
        };
        const getMainClothesGoogleDataQuery = `
      query getMainClothesGoogleData($image: String!) {
        getMainClothesGoogleData(image: $image) {
          status,
          content
        }
      }
    `;
        const cropImageToObjectQuery = `
      query cropImageToObject($image: String!, $object: String!) {
        cropImageToObject(image: $image, object: $object) {
          status,
          content
        }
      }
    `;
        const getImageMainColorQuery = `
      query getImageMainColor($image: String!) {
        getImageMainColor(image: $image) {
          status,
          content
        }
      }
    `;
        const getObjectDetailsQuery = `
      query getObjectDetails($image: String!) {
        getObjectDetails(image: $image) {
          status,
          content
        }
      }
    `;
        let imageData = null;
        try {
            imageData = await graphqlApollo_1.default.request(getMainClothesGoogleDataQuery, { image: image });
            if (imageData.getMainClothesGoogleData.status != common_1.HttpStatus.OK)
                console.error(imageData.getMainClothesGoogleData.content);
        }
        catch (err) {
            console.error(err.message);
            article.type = 'unknown';
            article.image_data = '{}';
            article.rgb = [-1, -1, -1];
        }
        if (imageData != null && imageData.getMainClothesGoogleData.status == common_1.HttpStatus.OK) {
            const imageDataContent = JSON.parse(imageData.getMainClothesGoogleData.content);
            if (!imageDataContent.name)
                article.type = 'unknown';
            else
                article.type = imageDataContent.name.toLowerCase();
            let croppedImage = null;
            try {
                croppedImage = await graphqlApollo_1.default.request(cropImageToObjectQuery, {
                    image: image, object: imageData.getMainClothesGoogleData.content
                });
            }
            catch (err) {
                console.error(err.message);
                console.log('3');
                article.image_data = '{}';
                article.rgb = [-1, -1, -1];
            }
            if (!croppedImage || croppedImage.cropImageToObject.status != common_1.HttpStatus.OK) {
                article.image_data = '{}';
                article.rgb = [-1, -1, -1];
            }
            else {
                let clotheContent = null;
                try {
                    clotheContent = await graphqlApollo_1.default.request(getObjectDetailsQuery, { image: croppedImage.cropImageToObject.content });
                }
                catch (err) {
                    console.error(err.message);
                    console.log('2');
                    article.image_data = '{}';
                    article.rgb = [-1, -1, -1];
                }
                if (clotheContent) {
                    clotheContent.getObjectDetails.content = cleanDetails(clotheContent);
                    article.image_data = JSON.stringify({ clothe: "imageData", details: clotheContent });
                    let color = null;
                    try {
                        color = await graphqlApollo_1.default.request(getImageMainColorQuery, { image: croppedImage.cropImageToObject.content });
                    }
                    catch (err) {
                        console.error(err.message);
                        console.log('1');
                        article.rgb = [-1, -1, -1];
                    }
                    if (!color || color.getImageMainColor.status != common_1.HttpStatus.OK) {
                        article.rgb = [-1, -1, -1];
                    }
                    else {
                        const rgb = JSON.parse(color.getImageMainColor.content);
                        if (rgb.red && rgb.blue && rgb.green)
                            article.rgb = [rgb.red, rgb.green, rgb.blue];
                        else
                            article.rgb = [-1, -1, -1];
                    }
                }
                else {
                    article.image_data = '{}';
                    article.rgb = [-1, -1, -1];
                }
            }
        }
        else {
            article.type = 'unknown';
            article.image_data = '{}';
            article.rgb = [-1, -1, -1];
        }
        console.log(article);
        if (article) {
            let red = -1;
            red = article.rgb[0];
            let green = -1;
            green = article.rgb[1];
            let blue = -1;
            blue = article.rgb[2];
            if (red >= 0 && green >= 0 && blue >= 0) {
                const res = await this.articleRepository.find({ where: { type: article.type } });
                let articlePartnerArraySorted = AnalysisService_1.orderByColor(article, res, (likeliness >= 0 ? 100 - likeliness : 0) * 5).map((elem, index) => {
                    return {
                        article: elem, grade: 100 / (index + 1) * 1.5
                    };
                });
                articlePartnerArraySorted = AnalysisService_1.orderBySharedArea(article, res).map((elem, index) => {
                    const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                    if (!article)
                        return null;
                    return {
                        article: elem, grade: (100 / (index + 1)) + article.grade
                    };
                });
                articlePartnerArraySorted = AnalysisService_1.orderByAmountOfDetails(article, res).map((elem, index) => {
                    const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                    if (!article)
                        return null;
                    return {
                        article: elem, grade: (100 / (index + 1)) + article.grade
                    };
                });
                articlePartnerArraySorted.sort((a, b) => b.grade - a.grade);
                return {
                    status: common_1.HttpStatus.OK,
                    devMessage: 'OK',
                    userMessage: 'OK',
                    articles: articlePartnerArraySorted.map(elem => elem.article)
                };
            }
            else
                return this.ArticleService.getAllArticlesPartner().then((articles) => {
                    if (minPrice >= 0 && maxPrice > minPrice)
                        articles.articles = articles.articles.filter((article) => article.price >= minPrice && article.price <= maxPrice);
                    const currentDate = new Date();
                    const updatePromises = articles.articles.map(async (article) => {
                        const articleToUpdate = await this.articleRepository.findOne({ where: { id: article.id } });
                        if (articleToUpdate) {
                            articleToUpdate.lastshown = currentDate;
                            await this.articleRepository.save(articleToUpdate);
                        }
                    });
                    return articles;
                });
        }
    }
    async findAlternative(URL, likeliness, minPrice, maxPrice) {
        try {
            let articleWeb = await this.ArticleWebService.isArticleUrlAlreadyParsed(URL);
            if (!articleWeb) {
                const scrapedArticle = await this.scraperService.ScrapeSite(URL);
                if (scrapedArticle)
                    await this.ArticleWebService.create({
                        name: scrapedArticle.name,
                        url: scrapedArticle.url,
                        brand: scrapedArticle.brand,
                        country: scrapedArticle.country,
                        material: scrapedArticle.material,
                        transport: scrapedArticle.transport,
                        price: Number(scrapedArticle.price),
                        image: scrapedArticle.image.toString()
                    });
                articleWeb = await this.articleWebRepository.findOne({ where: { url: URL } });
            }
            if (articleWeb) {
                let red = -1;
                red = articleWeb.rgb[0];
                let green = -1;
                green = articleWeb.rgb[1];
                let blue = -1;
                blue = articleWeb.rgb[2];
                if (red >= 0 && green >= 0 && blue >= 0) {
                    const res = await this.articleRepository.find({ where: { type: articleWeb.type } });
                    let articlePartnerArraySorted = AnalysisService_1.orderByColor(articleWeb, res, (likeliness >= 0 ? 100 - likeliness : 0) * 5).map((elem, index) => {
                        return {
                            article: elem, grade: 100 / (index + 1) * 1.5
                        };
                    });
                    articlePartnerArraySorted = AnalysisService_1.orderBySharedArea(articleWeb, res).map((elem, index) => {
                        const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                        if (!article)
                            return null;
                        return {
                            article: elem, grade: (100 / (index + 1)) + article.grade
                        };
                    });
                    articlePartnerArraySorted = AnalysisService_1.orderByAmountOfDetails(articleWeb, res).map((elem, index) => {
                        const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                        if (!article)
                            return null;
                        return {
                            article: elem, grade: (100 / (index + 1)) + article.grade
                        };
                    });
                    articlePartnerArraySorted.sort((a, b) => b.grade - a.grade);
                    return {
                        status: common_1.HttpStatus.OK,
                        devMessage: 'OK',
                        userMessage: 'OK',
                        articles: articlePartnerArraySorted.map(elem => elem.article).filter(elem2 => (elem2.price >= minPrice || minPrice == -1) && (elem2.price <= maxPrice || maxPrice == -1))
                    };
                }
                else
                    return {
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        devMessage: 'A problem occurred with the repository (findAlternative:articleWeb:rgb)',
                        userMessage: "The rgb digits of the article isn't conform",
                        articles: await this.getAllArticle(minPrice, maxPrice)
                    };
            }
        }
        catch (error) {
            console.error('Error while scraping:', error);
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (findAlternative:scraping)',
                userMessage: "Couldn't scrap proprely",
                articles: await this.getAllArticle(minPrice, maxPrice)
            };
        }
    }
    async uploadImages(file) {
        const uploadPath = path.join(__dirname, 'uploads');
        const fileName = `${Date.now()}-${file.originalname}`;
        await this.saveFile(file.buffer, path.join(uploadPath, fileName));
        const imagePath = path.join('uploads', fileName);
        return { content: imagePath };
    }
    saveFile(buffer, filePath) {
        return new Promise((resolve, reject) => {
            const writeStream = (0, fs_1.createWriteStream)(filePath);
            writeStream.write(buffer);
            writeStream.end();
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = AnalysisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_partner_entity_1.ArticlePartner)),
    __param(1, (0, typeorm_1.InjectRepository)(article_web_entity_1.ArticleWeb)),
    __param(5, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeorm_2.Repository, scraper_service_1.ScraperService, article_partner_service_1.ArticlePartnerService, article_web_service_1.ArticleWebService, typeorm_2.Repository])
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map