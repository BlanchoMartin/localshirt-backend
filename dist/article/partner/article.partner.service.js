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
var ArticlePartnerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlePartnerService = exports.cleanDetails = void 0;
const common_1 = require("@nestjs/common");
const article_dto_1 = require("./dto/article.dto");
const class_validator_1 = require("class-validator");
const logger_service_1 = require("../../logger/logger.service");
const typeorm_1 = require("@nestjs/typeorm");
const article_partner_entity_1 = require("../../database/entities/article.partner.entity");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../../database/entities/users.entity");
const criteria_entity_1 = require("../../database/entities/criteria.entity");
const computeScore_1 = require("../computeScore");
const graphqlApollo_1 = require("../../graphqlApollo");
function cleanDetails(content) {
    let oldContent = null;
    try {
        oldContent = JSON.parse(content.getObjectDetails.content);
    }
    catch (err) {
        console.error(err.message);
        return '{}';
    }
    const newContent = [];
    oldContent.map((elem) => {
        const isPresent = newContent.find(elem2 => elem2.description == elem.description);
        if (isPresent)
            return;
        newContent.push(elem);
    });
    return JSON.stringify(newContent);
}
exports.cleanDetails = cleanDetails;
let ArticlePartnerService = ArticlePartnerService_1 = class ArticlePartnerService {
    constructor(logger, articleRepository, usersRepository, criteriaRepository) {
        this.logger = logger;
        this.articleRepository = articleRepository;
        this.usersRepository = usersRepository;
        this.criteriaRepository = criteriaRepository;
    }
    isNumberOrBoolean(value) {
        const parsedNumber = parseFloat(value);
        if (!isNaN(parsedNumber)) {
            return true;
        }
        const lowercaseValue = value.toLowerCase();
        return lowercaseValue === 'true' || lowercaseValue === 'false';
    }
    async create(body, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : [];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, '123456');
        }
        catch (err) {
            console.error(err);
            return {
                status: common_1.HttpStatus.FORBIDDEN,
                devMessage: "Invalid token (ArticlePartnerService:create:token)",
                userMessage: "Vous n'avez pas les autorisations nécessaires pour effectuer cette action."
            };
        }
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
        const forms = new article_dto_1.ArticleDto();
        const article = new article_partner_entity_1.ArticlePartner();
        const types = [{ name: 'top', content: ['top', 'shirt'] }, { name: 'pantalon', content: [] }, { name: 'robe', content: [] }, { name: 'jupe', content: [] }, { name: 'manteau', content: [] }, { name: 'accessoire', content: [] }];
        let imageData = null;
        try {
            imageData = await graphqlApollo_1.default.request(getMainClothesGoogleDataQuery, { image: body.image });
            if (imageData.getMainClothesGoogleData.status != common_1.HttpStatus.OK)
                console.error(imageData.getMainClothesGoogleData.content);
        }
        catch (err) {
            console.error(err.message);
            forms.type = 'unknown';
            article.image_data = '{}';
            article.rgb = [-1, -1, -1];
        }
        if (imageData != null && imageData.getMainClothesGoogleData.status == common_1.HttpStatus.OK) {
            const imageDataContent = JSON.parse(imageData.getMainClothesGoogleData.content);
            if (!imageDataContent.name)
                forms.type = 'unknown';
            else {
                const correspondingType = types.find(elem => elem.content.find(elem2 => elem2 == imageDataContent.name.toLowerCase()));
                if (correspondingType)
                    forms.type = correspondingType.name;
                else
                    forms.type = imageDataContent.name.toLowerCase();
            }
            let croppedImage = null;
            try {
                croppedImage = await graphqlApollo_1.default.request(cropImageToObjectQuery, {
                    image: body.image, object: imageData.getMainClothesGoogleData.content
                });
            }
            catch (err) {
                console.error(err.message);
                article.image_data = '{}';
                forms.rgb = [-1, -1, -1];
            }
            if (!croppedImage || croppedImage.cropImageToObject.status != common_1.HttpStatus.OK) {
                article.image_data = '{}';
                forms.rgb = [-1, -1, -1];
            }
            else {
                let clotheContent = null;
                try {
                    clotheContent = await graphqlApollo_1.default.request(getObjectDetailsQuery, { image: croppedImage.cropImageToObject.content });
                }
                catch (err) {
                    console.error(err.message);
                    article.image_data = '{}';
                    forms.rgb = [-1, -1, -1];
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
                        forms.rgb = [-1, -1, -1];
                    }
                    if (!color || color.getImageMainColor.status != common_1.HttpStatus.OK) {
                        forms.rgb = [-1, -1, -1];
                    }
                    else {
                        const rgb = JSON.parse(color.getImageMainColor.content);
                        if (rgb.red && rgb.blue && rgb.green)
                            forms.rgb = [rgb.red, rgb.green, rgb.blue];
                        else
                            forms.rgb = [-1, -1, -1];
                    }
                }
                else {
                    article.image_data = '{}';
                    forms.rgb = [-1, -1, -1];
                }
            }
        }
        else {
            forms.type = 'unknown';
            article.image_data = '{}';
            article.rgb = [-1, -1, -1];
        }
        const brand = await this.usersRepository.findOne({ where: { email: decodedToken.email } }).then(value => value.businessName).catch(() => null);
        if (brand == null)
            return {
                status: common_1.HttpStatus.NOT_FOUND,
                devMessage: "Id not found (ArticlePartnerService:create:brand)",
                userMessage: "Impossible de trouver une marque."
            };
        forms.brand = brand;
        forms.redirection_url = body.redirection_url;
        forms.name = body.name;
        forms.image = Buffer.from(body.image, 'utf-8');
        const brandLogo = await this.usersRepository.findOne({ where: { email: decodedToken.email } }).then(value => value.business_logo.toString()).catch(() => '').catch(() => null);
        if (brandLogo == null)
            return {
                status: common_1.HttpStatus.NOT_FOUND,
                devMessage: "Id not found (ArticlePartnerService:create:brandLogo)",
                userMessage: "Impossible de trouver un logo de marque."
            };
        forms.brandlogo = Buffer.from(brandLogo, 'utf-8');
        forms.ethicaldesc = body.ethicaldesc;
        forms.environnementdesc = body.environnementdesc;
        forms.price = Math.round(body.price);
        forms.description = body.description;
        const brandDesc = await this.usersRepository.findOne({ where: { email: decodedToken.email } }).then(value => value.businessDescription).catch(() => null);
        if (brandDesc == null)
            return {
                status: common_1.HttpStatus.NOT_FOUND,
                devMessage: "Id not found (ArticlePartnerService:create:brandDesc)",
                userMessage: "Impossible de trouver une description de marque."
            };
        forms.branddesc = brandDesc;
        const now = new Date();
        forms.lastbought = now;
        forms.lastshown = now;
        forms.lastclick = now;
        const errors = await (0, class_validator_1.validate)(forms);
        if (errors.length > 0) {
            this.logger.debug(`${errors}`, ArticlePartnerService_1.name);
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                devMessage: 'Invalid content (ArticlePartnerService:create:DTO)',
                userMessage: 'Le contenu de la requête est invalide.'
            };
        }
        article.brand = forms.brand;
        article.name = forms.name;
        article.redirection_url = forms.redirection_url;
        try {
            article.country = JSON.stringify(body.country);
            article.material = JSON.stringify(body.material);
            article.transport = JSON.stringify(body.transport);
        }
        catch (err) {
            console.error(err.message);
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                devMessage: 'Invalid content (ArticlePartnerService:create:country/material/transport)',
                userMessage: 'Le contenu de la requête est invalide.'
            };
        }
        article.email = decodedToken.email;
        article.image = forms.image;
        article.description = forms.description;
        article.branddesc = forms.branddesc;
        article.brandlogo = forms.brandlogo;
        article.ethicaldesc = forms.ethicaldesc;
        article.environnementdesc = forms.environnementdesc;
        article.price = forms.price;
        article.rgb = forms.rgb;
        article.type = forms.type;
        article.lastbought = forms.lastbought;
        article.lastshown = forms.lastshown;
        article.lastclick = forms.lastclick;
        const criteria = {
            tag: '',
            type: '',
            local_score: -1,
            ethical_score: -1,
            ecological_score: -1,
            id: '',
            additionalCriteria: JSON.stringify(body.country
                .map((criteria) => {
                return {
                    result: criteria.name, question: {
                        criteria_application: 'all', factor: 1, minimize: false, user_response_type: 'criteria',
                    },
                };
            })
                .concat(body.transport.map((criteria) => {
                return {
                    result: criteria.name, question: {
                        criteria_application: 'all', factor: 1, minimize: false, user_response_type: 'criteria',
                    },
                };
            }))
                .concat(body.material.map((criteria) => {
                return {
                    result: criteria.name, question: {
                        criteria_application: 'all', factor: 1, minimize: false, user_response_type: 'criteria',
                    },
                };
            }))
                .concat(body.additionalCriteria)),
        };
        let score = await (0, computeScore_1.computeScore)(criteria, computeScore_1.ScoreApplication.ECOLOGICAL, this.criteriaRepository);
        article.ecological_score = score.score;
        score = await (0, computeScore_1.computeScore)(criteria, computeScore_1.ScoreApplication.ETHICAL, this.criteriaRepository);
        article.ethical_score = score.score;
        article.local_score = Math.floor((article.ecological_score + article.ethical_score) / 2);
        try {
            await this.articleRepository.save(article);
            return { status: common_1.HttpStatus.OK, devMessage: 'OK', userMessage: 'L\'article a été créé avec succès.' };
        }
        catch (error) {
            console.error(error);
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (ArticlePartnerService:create:save)',
                userMessage: 'Une erreur est survenue lors de la création de l\'article. Veuillez réessayer plus tard.'
            };
        }
    }
    isUUID(str) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }
    async delete(id, req) {
        var _a, _b;
        const isValid = this.isUUID(id);
        if (!isValid) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                devMessage: 'Invalid content (ArticlePartnerService:delete:UUID)',
                userMessage: 'L\'identifiant spécifié n\'est pas valide. Veuillez fournir un identifiant UUID valide.'
            };
        }
        const article = await this.articleRepository.find({
            where: { id: id },
        });
        const jwt = require('jsonwebtoken');
        const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : [];
        try {
            const decodedToken = jwt.verify(token, '123456');
            if (article && article[0].email == decodedToken.email) {
                try {
                    await this.articleRepository.remove(article[0]);
                }
                catch (error) {
                    console.error(error);
                    return {
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        devMessage: 'A problem occurred with the repository (ArticlePartnerService:delete:remove)',
                        userMessage: 'Une erreur est survenue lors de la suppression de l\'article. Veuillez réessayer plus tard.'
                    };
                }
                return { status: common_1.HttpStatus.OK, devMessage: 'OK', userMessage: 'L\'article a été supprimé avec succès.' };
            }
            else {
                return {
                    status: common_1.HttpStatus.NOT_FOUND,
                    devMessage: 'Id not found (ArticlePartnerService:delete:email)',
                    userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.'
                };
            }
        }
        catch (_c) {
            return {
                status: common_1.HttpStatus.FORBIDDEN,
                devMessage: 'Invalid token (ArticlePartnerService:delete:token)',
                userMessage: 'Vous n\'avez pas les autorisations nécessaires pour supprimer cet article.'
            };
        }
    }
    async update(id, body, req) {
        var _a, _b;
        let isOk = false;
        const transformStringToArray = (str) => {
            const countries = str.split(',').map(country => country.trim());
            const jsonString = JSON.stringify(countries.map(country => ({ name: country })));
            return jsonString;
        };
        const jwt = require('jsonwebtoken');
        const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : [];
        const forms = new article_dto_1.ArticleDto();
        forms.brand = body.brand;
        forms.name = body.name;
        forms.redirection_url = !body.isAdmin ? body.redirection_url : '';
        forms.image = !body.isAdmin ? Buffer.from(body.image, 'utf-8') : Buffer.from('', 'utf-8');
        forms.description = body.description;
        forms.branddesc = body.branddesc;
        forms.brandlogo = Buffer.from(body.brandlogo, 'utf-8');
        forms.ethicaldesc = body.ethicaldesc;
        forms.environnementdesc = body.environnementdesc;
        forms.price = parseFloat(body.price);
        forms.type = body.type;
        forms.lastbought = typeof body.lastbought === 'string' ? new Date(body.lastbought) : body.lastbought;
        forms.lastshown = typeof body.lastshown === 'string' ? new Date(body.lastshown) : body.lastshown;
        forms.lastclick = typeof body.lastclick === 'string' ? new Date(body.lastclick) : body.lastclick;
        const errors = await (0, class_validator_1.validate)(forms);
        if (errors.length > 0) {
            this.logger.debug(`${errors}`, ArticlePartnerService_1.name);
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                devMessage: 'Invalid content (ArticlePartnerService:updateArticle:DTO)',
                userMessage: 'Le contenu de la requête est invalide.'
            };
        }
        const isValid = this.isUUID(id);
        if (!isValid) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                devMessage: 'Invalid request (ArticlePartnerService:updateArticle:UUID)',
                userMessage: 'L\'identifiant spécifié n\'est pas valide. Veuillez fournir un identifiant UUID valide.'
            };
        }
        const decodedToken = jwt.verify(token, '123456');
        const article = await this.articleRepository.findOne({
            where: { id: id },
        });
        if (!article) {
            return {
                status: common_1.HttpStatus.NOT_FOUND,
                devMessage: 'Id not found (ArticlePartnerService:updateArticle:article)',
                userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.'
            };
        }
        if (article.email == decodedToken.email || (decodedToken && !decodedToken.isDeveloper)) {
            article.brand = forms.brand;
            article.name = forms.name;
            article.redirection_url = body.isAdmin ? article.redirection_url : forms.redirection_url;
            article.country = body.isAdmin ? transformStringToArray(body.country) : JSON.stringify(body.country);
            article.material = body.isAdmin ? transformStringToArray(body.material) : JSON.stringify(body.material);
            article.transport = body.isAdmin ? transformStringToArray(body.transport) : JSON.stringify(body.transport);
            article.image = body.isAdmin ? article.image : Buffer.from(body.image, 'utf-8');
            article.description = forms.description;
            article.branddesc = forms.branddesc;
            article.brandlogo = Buffer.from(body.brandlogo, 'utf-8');
            article.ethicaldesc = forms.ethicaldesc;
            article.environnementdesc = forms.environnementdesc;
            article.price = forms.price;
            article.type = forms.type;
            article.lastbought = forms.lastbought;
            article.lastshown = forms.lastshown;
            article.lastclick = forms.lastclick;
            await this.articleRepository.save(article);
            isOk = true;
            if (isOk) {
                return {
                    status: common_1.HttpStatus.OK, devMessage: 'OK', userMessage: 'L\'article a été mis à jour avec succès.'
                };
            }
            else {
                return {
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    devMessage: 'A problem occurred with the repository (ArticlePartnerService:updateArticle:save)',
                    userMessage: 'Une erreur est survenue lors de la mise à jour de l\'article. Veuillez réessayer plus tard.'
                };
            }
        }
        else {
            return {
                status: common_1.HttpStatus.FORBIDDEN,
                devMessage: 'Invalid token (ArticlePartnerService:updateArticle:token)',
                userMessage: 'Vous n\'avez pas les autorisations nécessaires pour effectuer cette action.'
            };
        }
    }
    async getArticlePublicList(filters) {
        const propertyToField = {
            brand: 'brand',
            name: 'name',
            price: 'price',
            ethical_score: 'ethical_score',
            ecological_score: 'ecological_score',
            local_score: 'local_score',
            country: 'country',
            material: 'material',
            transport: 'transport',
            type: 'type',
            lastbought: 'lastbought',
            lastshown: 'lastshown',
            lastclick: 'lastclick',
        };
        const operators = {
            '==': '=', infeq: '<=', inf: '<', supeq: '>=', sup: '>',
        };
        const filtersArray = filters.split(':');
        const whereConditions = [];
        let tmpFilteredArticlesList = [];
        for (let i = 0; i < filtersArray.length; i++) {
            const [property, operator, value] = filtersArray[i].split(/(==|infeq|inf|supeq|sup)/);
            const field = propertyToField[property.trim()];
            if (!field) {
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    devMessage: 'Invalid content (ArticlePartnerService:getArticlePublicList:field)',
                    userMessage: 'Le contenu de la requête est invalide.',
                    articles: []
                };
            }
            const trimmedValue = value.trim();
            const isStringProperty = this.isNumberOrBoolean(trimmedValue);
            if (isStringProperty == false && operator.trim() === '==' && !(field === 'material' || field === 'transport' || field === 'country')) {
                whereConditions.push(`article.${field} LIKE '${trimmedValue}%'`);
            }
            else if (!(field === 'material' || field === 'transport' || field === 'country')) {
                whereConditions.push(`article.${field} ${operators[operator.trim()]} '${trimmedValue}'`);
            }
            if (field === 'material' || field === 'transport' || field === 'country') {
                let fieldFilteredArticles = [];
                const criteriaUsingJSON = await this.articleRepository.find();
                criteriaUsingJSON.forEach((criteria) => {
                    JSON.parse(criteria[field]).forEach((criteriaField) => {
                        if (criteriaField.name === trimmedValue) {
                            fieldFilteredArticles.push(criteria);
                        }
                    });
                });
                tmpFilteredArticlesList.push(fieldFilteredArticles);
            }
        }
        const whereClause = whereConditions.join(' AND ');
        try {
            const filteredArticles = await this.articleRepository
                .createQueryBuilder('article')
                .where(whereClause)
                .getMany();
            let remainingTmpFilteredArticlesList = [];
            for (let j = 0; j < tmpFilteredArticlesList[0].length; j++) {
                let present = true;
                for (let i = 0; i < tmpFilteredArticlesList.length; i++) {
                    if (!tmpFilteredArticlesList[i].find((elem) => elem.id === tmpFilteredArticlesList[0][j].id)) {
                        present = false;
                    }
                }
                if (present) {
                    if (filteredArticles.length <= 0) {
                        remainingTmpFilteredArticlesList.push(tmpFilteredArticlesList[0][j]);
                    }
                    else {
                        if (filteredArticles.find((elem) => elem.id === tmpFilteredArticlesList[0][j].id)) {
                            remainingTmpFilteredArticlesList.push(tmpFilteredArticlesList[0][j]);
                        }
                    }
                }
            }
            const resultArticle = remainingTmpFilteredArticlesList.map((article) => (Object.assign(Object.assign({}, article), { image: article.image.toString('utf-8'), brandlogo: article.brandlogo.toString('utf-8'), material: JSON.parse(article.material).map((elem) => {
                    return { name: elem.name };
                }), country: JSON.parse(article.country).map((elem) => {
                    return { name: elem.name };
                }), transport: JSON.parse(article.transport).map((elem) => {
                    return { name: elem.name };
                }) })));
            return {
                status: common_1.HttpStatus.OK,
                devMessage: 'OK',
                userMessage: 'Articles trouvés avec succès.',
                articles: resultArticle
            };
        }
        catch (error) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (ArticlePartnerService:getArticlePublicList:resultArticle)',
                userMessage: 'Une erreur est survenue lors de la recherche des articles. Veuillez réessayer plus tard.',
                articles: []
            };
        }
    }
    async getArticlesByUserId(req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : [];
        const decodedToken = jwt.verify(token, '123456');
        try {
            const filteredArticles = await this.articleRepository.find({
                where: { email: decodedToken.email },
            });
            if (filteredArticles.length === 0) {
                return {
                    status: common_1.HttpStatus.NOT_FOUND,
                    devMessage: 'Id not found (ArticlePartnerService:getArticlesByUserId:filteredArticle)',
                    userMessage: 'Aucun article trouvé pour cet utilisateur.',
                    articles: [],
                };
            }
            const resultArticle = filteredArticles.map((article) => (Object.assign(Object.assign({}, article), { image: article.image.toString('utf-8'), brandlogo: article.brandlogo.toString('utf-8'), country: JSON.parse(article.country), transport: JSON.parse(article.transport), material: JSON.parse(article.material) })));
            return {
                status: common_1.HttpStatus.OK,
                devMessage: 'OK',
                userMessage: 'Articles récupérés avec succès.',
                articles: resultArticle,
            };
        }
        catch (error) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (ArticlePartnerService:getArticlesByUserId:resultArticle)',
                userMessage: 'Une erreur est survenue lors de la récupération des articles de l\'utilisateur. Veuillez réessayer plus tard.',
                articles: [],
            };
        }
    }
    async updateArticleLastClick(articleId) {
        const isValid = await this.isUUID(articleId);
        if (!isValid) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST, devMessage: "Invalid content (ArticlePartnerService:updateArticleLastClick:uuid)", userMessage: "bad request"
            };
        }
        const article = await this.articleRepository.find({
            where: { id: articleId },
        });
        if (!article) {
            return { status: 400, devMessage: "Article not found (ArticlePartnerService:updateArticleLastClick:article)", userMessage: "article not found" };
        }
        article[0].lastclick = new Date();
        await this.articleRepository.save(article);
        return { status: 200, devMessage: "OK", userMessage: "OK" };
    }
    meetsNumericCondition(fieldValue, operator, numericValue) {
        if (typeof fieldValue !== 'number') {
            console.warn(`Field value is not a number.`);
            return false;
        }
        switch (operator) {
            case '==':
                return fieldValue === numericValue;
            case 'sup':
                return fieldValue > numericValue;
            case 'inf':
                return fieldValue < numericValue;
            case 'supeq':
                return fieldValue >= numericValue;
            case 'infeq':
                return fieldValue <= numericValue;
            default:
                console.error(`Invalid operator: ${operator}`);
                return false;
        }
    }
    filterArticlesByCountries(articles, key, countryArray, resultArticles) {
        articles.forEach((article) => {
            if (typeof article[key] === 'string') {
                try {
                    const json = JSON.parse(article[key]);
                    if (Array.isArray(json)) {
                        json.forEach((item) => {
                            if (typeof item === 'object' && 'name' in item) {
                                if (countryArray.includes(item.name)) {
                                    resultArticles.push(article);
                                }
                            }
                        });
                    }
                    else {
                        console.warn(`Expected JSON array in article ${article.id}, but got:`, json);
                    }
                }
                catch (error) {
                    console.error(`Error parsing JSON for article ${article.id}:`, error);
                }
            }
        });
    }
    async getAllArticlesPartner() {
        try {
            const articles = await this.articleRepository.find();
            const transformedArticles = articles.map((article) => {
                var _a, _b, _c, _d;
                return (Object.assign(Object.assign({}, article), { image: (_b = (_a = article.image) === null || _a === void 0 ? void 0 : _a.toString('utf-8')) !== null && _b !== void 0 ? _b : '', brandlogo: (_d = (_c = article.brandlogo) === null || _c === void 0 ? void 0 : _c.toString('utf-8')) !== null && _d !== void 0 ? _d : '', country: article.country ? JSON.parse(article.country) : [], transport: article.transport ? JSON.parse(article.transport) : [], material: article.material ? JSON.parse(article.material) : [] }));
            });
            return {
                status: common_1.HttpStatus.OK,
                devMessage: 'OK',
                userMessage: 'Les articles ont été récupérés avec succès.',
                articles: transformedArticles,
            };
        }
        catch (error) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (ArticlePartnerService:getAllArticlesPartner:find)',
                userMessage: 'Une erreur est survenue lors de la récupération des articles. Veuillez réessayer plus tard.',
                articles: [],
            };
        }
    }
    async getArticlePartnerList(filters, req) {
        const nonNullFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null));
        const fieldTypesMap = {
            name: 'string',
            brand: 'string',
            country: 'list',
            material: 'list',
            transport: 'list',
            price: 'number',
            ethical_score: 'number',
            ecological_score: 'number',
            local_score: 'number',
            type: 'string',
            lastbought: 'date',
            lastshown: 'date',
            lastclick: 'date',
        };
        const operators = {
            '==': '=', infeq: '<=', inf: '<', supeq: '>=', sup: '>',
        };
        const allArticles = await this.articleRepository.find();
        let resultArticles = [];
        for (const [key, value] of Object.entries(nonNullFilters)) {
            const [res, operator, val] = value.split(/(==|infeq|inf|supeq|sup)/);
            if (fieldTypesMap[key] == 'string' && (typeof value == "string")) {
                if (resultArticles.length == 0) {
                    resultArticles = allArticles.filter(article => article[key].startsWith(value));
                }
                else {
                    resultArticles = resultArticles.filter(article => article[key].startsWith(value));
                }
            }
            else if (fieldTypesMap[key] == 'list' && (typeof value == "string")) {
                const countryArray = value.split(",");
                if (resultArticles.length == 0) {
                    this.filterArticlesByCountries(allArticles, key, countryArray, resultArticles);
                }
                else {
                    let tempResult = [];
                    this.filterArticlesByCountries(resultArticles, key, countryArray, tempResult);
                    resultArticles = tempResult;
                }
            }
            else if (fieldTypesMap[key] == 'number' && (typeof value == "string")) {
                const numericValue = parseFloat(val);
                if (resultArticles.length === 0) {
                    resultArticles = allArticles.filter((article) => {
                        return this.meetsNumericCondition(article[key], operator, numericValue);
                    });
                }
                else {
                    resultArticles = resultArticles.filter((article) => {
                        return this.meetsNumericCondition(article[key], operator, numericValue);
                    });
                }
            }
        }
        const res = resultArticles.map((article) => (Object.assign(Object.assign({}, article), { image: article.image.toString('utf-8'), brandlogo: article.brandlogo.toString('utf-8'), country: JSON.parse(article.country), transport: JSON.parse(article.transport), material: JSON.parse(article.material) })));
        if (res.length === 0)
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: "A problem occurred with the repository (ArticlePartnerSerice:getArticlePartnerList:resultArticles.map",
                userMessage: "Il n'y a aucun articles correspondant à vos recherches !",
                articles: res
            };
        return {
            status: common_1.HttpStatus.OK,
            devMessage: "OK",
            userMessage: "Voici les articles correspondant à votre recherche !",
            articles: res
        };
    }
};
exports.ArticlePartnerService = ArticlePartnerService;
exports.ArticlePartnerService = ArticlePartnerService = ArticlePartnerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(article_partner_entity_1.ArticlePartner)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __param(3, (0, typeorm_1.InjectRepository)(criteria_entity_1.Criteria)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, typeorm_2.Repository, typeorm_2.Repository, typeorm_2.Repository])
], ArticlePartnerService);
//# sourceMappingURL=article.partner.service.js.map