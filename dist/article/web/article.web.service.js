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
var ArticleWebService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleWebService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const logger_service_1 = require("../../logger/logger.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const criteria_entity_1 = require("../../database/entities/criteria.entity");
const article_web_entity_1 = require("../../database/entities/article.web.entity");
const article_web_dto_1 = require("./dto/article.web.dto");
const schedule_1 = require("@nestjs/schedule");
const computeScore_1 = require("../computeScore");
const graphqlApollo_1 = require("../../graphqlApollo");
const article_partner_service_1 = require("../partner/article.partner.service");
let ArticleWebService = ArticleWebService_1 = class ArticleWebService {
    constructor(logger, articleWebRepository, criteriaRepository) {
        this.logger = logger;
        this.articleWebRepository = articleWebRepository;
        this.criteriaRepository = criteriaRepository;
    }
    async deleteExpiredArticleWeb() {
        await this.articleWebRepository.find().then((articlesWeb) => {
            const date = new Date().getTime();
            articlesWeb.forEach((article) => {
                if (date - article.creation_date.getTime() >
                    Number(process.env.ARTICLE_WEB_MAX_KEEP_TIME) * 60000) {
                    this.deleteById(article.id);
                }
            });
        });
    }
    async createArticleFromDTO(articleWebDTO) {
        const articleWeb = new article_web_entity_1.ArticleWeb();
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
        const types = [{ name: 'top', content: ['top', 'shirt'] }, { name: 'pantalon', content: [] }, { name: 'robe', content: [] }, { name: 'jupe', content: [] }, { name: 'manteau', content: [] }, { name: 'accessoire', content: [] }];
        let imageData = null;
        try {
            imageData = await graphqlApollo_1.default.request(getMainClothesGoogleDataQuery, { image: articleWebDTO.image });
            if (imageData.getMainClothesGoogleData.status != common_1.HttpStatus.OK)
                console.error(imageData.getMainClothesGoogleData.content);
        }
        catch (err) {
            console.error('imageData', err.message);
            articleWeb.type = 'unknown';
            articleWeb.image_data = '{}';
            articleWeb.rgb = [-1, -1, -1];
        }
        if (imageData != null && imageData.getMainClothesGoogleData.status == common_1.HttpStatus.OK) {
            const imageDataContent = JSON.parse(imageData.getMainClothesGoogleData.content);
            if (!imageDataContent.name)
                articleWeb.type = 'unknown';
            else {
                const correspondingType = types.find(elem => elem.content.find(elem2 => elem2 == imageDataContent.name.toLowerCase()));
                if (correspondingType)
                    articleWeb.type = correspondingType.name;
                else
                    articleWeb.type = imageDataContent.name.toLowerCase();
            }
            let croppedImage = null;
            try {
                croppedImage = await graphqlApollo_1.default.request(cropImageToObjectQuery, {
                    image: articleWebDTO.image,
                    object: imageData.getMainClothesGoogleData.content
                });
            }
            catch (err) {
                console.error('croppedImage', err.message);
                articleWeb.image_data = '{}';
                articleWeb.rgb = [-1, -1, -1];
            }
            if (!croppedImage || croppedImage.cropImageToObject.status != common_1.HttpStatus.OK) {
                articleWeb.image_data = '{}';
                articleWeb.rgb = [-1, -1, -1];
            }
            else {
                let clotheContent = null;
                try {
                    clotheContent = await graphqlApollo_1.default.request(getObjectDetailsQuery, { image: croppedImage.cropImageToObject.content });
                }
                catch (err) {
                    console.error('clotheContent', err.message);
                    articleWeb.image_data = '{}';
                    articleWeb.rgb = [-1, -1, -1];
                }
                if (clotheContent) {
                    clotheContent.getObjectDetails.content = (0, article_partner_service_1.cleanDetails)(clotheContent);
                    articleWeb.image_data = JSON.stringify({ clothe: "imageData", details: clotheContent });
                    let color = null;
                    try {
                        color = await graphqlApollo_1.default.request(getImageMainColorQuery, { image: croppedImage.cropImageToObject.content });
                    }
                    catch (err) {
                        console.error('color', err.message);
                        articleWeb.rgb = [-1, -1, -1];
                    }
                    if (!color || color.getImageMainColor.status != common_1.HttpStatus.OK) {
                        articleWeb.rgb = [-1, -1, -1];
                    }
                    else {
                        const rgb = JSON.parse(color.getImageMainColor.content);
                        if (rgb.red && rgb.blue && rgb.green)
                            articleWeb.rgb = [rgb.red, rgb.green, rgb.blue];
                        else
                            articleWeb.rgb = [-1, -1, -1];
                    }
                }
                else {
                    articleWeb.image_data = '{}';
                    articleWeb.rgb = [-1, -1, -1];
                }
            }
        }
        else {
            articleWeb.type = 'unknown';
            articleWeb.image_data = '{}';
            articleWeb.rgb = [-1, -1, -1];
        }
        articleWeb.brand = articleWebDTO.brand;
        articleWeb.name = articleWebDTO.name;
        articleWeb.url = articleWebDTO.url;
        articleWeb.country = articleWebDTO.country;
        articleWeb.material = articleWebDTO.material;
        articleWeb.transport = articleWebDTO.transport;
        articleWeb.price = articleWebDTO.price;
        articleWeb.image = Buffer.from(articleWebDTO.image, 'utf-8');
        const criteria = {
            tag: '',
            ethical_score: -1,
            local_score: -1,
            ecological_score: -1,
            id: '',
            type: '',
            additionalCriteria: JSON.stringify(JSON.parse(articleWebDTO.country)
                .map((criteria) => {
                return {
                    result: criteria.name,
                    question: {
                        questionId: '',
                        criteria_application: 'all',
                        factor: 1,
                        minimize: false,
                        user_response_type: 'criteria',
                    },
                };
            })
                .concat(JSON.parse(articleWebDTO.transport).map((criteria) => {
                return {
                    result: criteria.name,
                    question: {
                        questionId: '',
                        criteria_application: 'all',
                        factor: 1,
                        minimize: false,
                        user_response_type: 'criteria',
                    },
                };
            }))
                .concat(JSON.parse(articleWebDTO.material).map((criteria) => {
                return {
                    result: criteria.name,
                    question: {
                        questionId: '',
                        criteria_application: 'all',
                        factor: 1,
                        minimize: false,
                        user_response_type: 'criteria',
                    },
                };
            })))
        };
        let score = await (0, computeScore_1.computeScore)(criteria, computeScore_1.ScoreApplication.ECOLOGICAL, this.criteriaRepository);
        articleWeb.ecological_score = score.score;
        score = await (0, computeScore_1.computeScore)(criteria, computeScore_1.ScoreApplication.ETHICAL, this.criteriaRepository);
        articleWeb.ethical_score = score.score;
        articleWeb.local_score = Math.floor((articleWeb.ecological_score + articleWeb.ethical_score) / 2);
        articleWeb.creation_date = new Date();
        return articleWeb;
    }
    async checkDTO(body, articleWebDTO) {
        articleWebDTO.brand = body.brand;
        articleWebDTO.name = body.name;
        articleWebDTO.url = body.url;
        articleWebDTO.country = JSON.stringify(body.country);
        articleWebDTO.material = JSON.stringify(body.material);
        articleWebDTO.transport = JSON.stringify(body.transport);
        articleWebDTO.price = Math.round(body.price);
        articleWebDTO.image = body.image;
        return await (0, class_validator_1.validate)(articleWebDTO).then((errors) => {
            if (errors.length > 0) {
                this.logger.debug(`${errors}`, ArticleWebService_1.name);
                return false;
            }
            else {
                return true;
            }
        });
    }
    async create(body) {
        const articleWebDTO = new article_web_dto_1.ArticleWebDTO();
        let isOk = await this.checkDTO(body, articleWebDTO);
        if (!isOk) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                devMessage: 'Invalid content (ArticleWebService:create:DTO)',
                userMessage: `Le contenu de la requête est invalide.`
            };
        }
        try {
            await this.articleWebRepository.save(await this.createArticleFromDTO(articleWebDTO));
        }
        catch (error) {
            isOk = false;
            console.error(error);
        }
        if (isOk) {
            while (await this.articleWebRepository.count() > Number(process.env.ARTICLE_WEB_MAX_NUMBER)) {
                await this.deleteOlder();
            }
            return { status: common_1.HttpStatus.OK, devMessage: 'OK', userMessage: `L'article a été collecté avec succès pour être comparé.` };
        }
        else {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (ArticleWebService:create:save)',
                userMessage: 'Une erreur est survenue lors de la création de la collection de la page web. Veuillez réessayer plus tard.'
            };
        }
    }
    async deleteOlder() {
        const articlesWeb = await this.articleWebRepository.find();
        let older = 0;
        for (let i = 0; i < articlesWeb.length; i++) {
            if (articlesWeb[i].creation_date.getTime() <
                articlesWeb[older].creation_date.getTime())
                older = i;
        }
        await this.deleteById(articlesWeb[older].id);
    }
    async deleteById(id) {
        const articleWeb = await this.articleWebRepository.findOne({
            where: { id },
        });
        if (articleWeb) {
            await this.articleWebRepository.remove(articleWeb);
            return { status: common_1.HttpStatus.OK, devMessage: 'OK', userMessage: 'L\'article a été supprimé avec succès.' };
        }
        else {
            return { status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (ArticleWebService:deleteById:remove)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
        }
    }
    async updateById(body) {
        try {
            const articleInfo = await this.articleWebRepository.findOne({
                where: { id: body.id },
            });
            if (!articleInfo) {
                return { status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (ArticleWebService:updateById:findOne)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
            }
            const propertiesToUpdate = [
                'name',
                'url',
                'brand',
                'country',
                'material',
                'transport',
                'price',
                'picture_data'
            ];
            propertiesToUpdate.forEach((property) => {
                if (body[property] !== null) {
                    articleInfo[property] = body[property];
                }
            });
            await this.articleWebRepository.save(articleInfo);
            return { status: common_1.HttpStatus.OK, devMessage: 'OK', userMessage: 'L\'article a été mis à jour avec succès.' };
        }
        catch (error) {
            console.error(error.message);
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (ArticleWebService:updateById:save)',
                userMessage: 'Une erreur est survenue lors de la création de la collection de la page web. Veuillez réessayer plus tard.'
            };
        }
    }
    async isArticleUrlAlreadyParsed(url) {
        const foundArticle = await this.articleWebRepository.findOne({ where: { url: url } });
        if (!foundArticle)
            return null;
        return foundArticle;
    }
};
exports.ArticleWebService = ArticleWebService;
__decorate([
    (0, schedule_1.Cron)(`*/${Number(process.env.ARTICLE_WEB_CLEANER_INTERVAL)} * * * *`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticleWebService.prototype, "deleteExpiredArticleWeb", null);
exports.ArticleWebService = ArticleWebService = ArticleWebService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(article_web_entity_1.ArticleWeb)),
    __param(2, (0, typeorm_1.InjectRepository)(criteria_entity_1.Criteria)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ArticleWebService);
//# sourceMappingURL=article.web.service.js.map