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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleWebResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const article_web_service_1 = require("./article.web.service");
const article_web_model_1 = require("./article.web.model");
let ArticleWebResolver = class ArticleWebResolver {
    constructor(articleWebService) {
        this.articleWebService = articleWebService;
    }
    async createArticleWeb(name, url, brand, country, material, transport, price, image) {
        return this.articleWebService.create({
            name,
            url,
            brand,
            country,
            material,
            transport,
            price,
            image
        });
    }
    async updateArticleWebById(id, name, url, brand, country, material, transport, price, image) {
        return this.articleWebService.updateById({
            id,
            name,
            url,
            brand,
            country,
            material,
            transport,
            price,
            image
        });
    }
    async deleteArticleWebById(id) {
        return this.articleWebService.deleteById(id);
    }
    async isArticleUrlAlreadyParsed(url) {
        return this.articleWebService.isArticleUrlAlreadyParsed(url);
    }
};
exports.ArticleWebResolver = ArticleWebResolver;
__decorate([
    (0, graphql_1.Query)((returns) => article_web_model_1.ArticleWebResponse),
    __param(0, (0, graphql_1.Args)('name')),
    __param(1, (0, graphql_1.Args)('url')),
    __param(2, (0, graphql_1.Args)('brand')),
    __param(3, (0, graphql_1.Args)({ name: 'country', type: () => [article_web_model_1.CountryInput] })),
    __param(4, (0, graphql_1.Args)({ name: 'material', type: () => [article_web_model_1.MaterialInput] })),
    __param(5, (0, graphql_1.Args)({ name: 'transport', type: () => [article_web_model_1.TransportInput] })),
    __param(6, (0, graphql_1.Args)('price')),
    __param(7, (0, graphql_1.Args)('image')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array, Array, Array, Number, String]),
    __metadata("design:returntype", Promise)
], ArticleWebResolver.prototype, "createArticleWeb", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_web_model_1.ArticleWebResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('name', { defaultValue: null, nullable: true })),
    __param(2, (0, graphql_1.Args)('url', { defaultValue: null, nullable: true })),
    __param(3, (0, graphql_1.Args)('brand', { defaultValue: null, nullable: true })),
    __param(4, (0, graphql_1.Args)({ name: 'country', type: () => [article_web_model_1.CountryInput], defaultValue: null, nullable: true })),
    __param(5, (0, graphql_1.Args)({ name: 'material', type: () => [article_web_model_1.MaterialInput], defaultValue: null, nullable: true })),
    __param(6, (0, graphql_1.Args)({ name: 'transport', type: () => [article_web_model_1.TransportInput], defaultValue: null, nullable: true })),
    __param(7, (0, graphql_1.Args)('price', { defaultValue: null, nullable: true })),
    __param(8, (0, graphql_1.Args)('image', { defaultValue: null, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Array, Array, Array, Number, String]),
    __metadata("design:returntype", Promise)
], ArticleWebResolver.prototype, "updateArticleWebById", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_web_model_1.ArticleWebResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticleWebResolver.prototype, "deleteArticleWebById", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_web_model_1.ArticleWebObject),
    __param(0, (0, graphql_1.Args)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticleWebResolver.prototype, "isArticleUrlAlreadyParsed", null);
exports.ArticleWebResolver = ArticleWebResolver = __decorate([
    (0, graphql_1.Resolver)('ArticleWeb'),
    __metadata("design:paramtypes", [article_web_service_1.ArticleWebService])
], ArticleWebResolver);
//# sourceMappingURL=article.web.resolver.js.map