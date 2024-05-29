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
exports.ArticlePartnerResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const article_partner_service_1 = require("./article.partner.service");
const article_partner_model_1 = require("./article.partner.model");
const criteria_model_1 = require("../../criteria/criteria.model");
const article_partner_model_2 = require("./article.partner.model");
let ArticlePartnerResolver = class ArticlePartnerResolver {
    constructor(articlePartnerService) {
        this.articlePartnerService = articlePartnerService;
    }
    async createArticlePartner(name, redirection_url, material, country, transport, price, image, description, environnementdesc, ethicaldesc, additionalCriteria, context) {
        return this.articlePartnerService.create({ name, redirection_url, country, material, transport, price, image, description, environnementdesc, ethicaldesc, additionalCriteria }, context.req);
    }
    async deleteArticlePartner(id, context) {
        return this.articlePartnerService.delete(id, context.req);
    }
    async updateArticlePartner(id, name, country, material, transport, price, image, brandlogo, description, branddesc, environnementdesc, ethicaldesc, type, lastbought, lastshown, lastclick, context) {
        return this.articlePartnerService.update(id, { name, country, material, transport, price, image, brandlogo, description, branddesc, environnementdesc, ethicaldesc, type, lastbought, lastshown, lastclick, isAdmin: false }, context.req);
    }
    async updateArticlePartnerAdmin(id, name, brand, country, material, transport, price, brandlogo, description, branddesc, environnementdesc, ethicaldesc, type, lastbought, lastshown, lastclick, context) {
        return this.articlePartnerService.update(id, {
            name: name,
            brand: brand,
            country: country,
            material: material,
            transport: transport,
            price: price,
            brandlogo: brandlogo,
            description: description,
            branddesc: branddesc,
            environnementdesc: environnementdesc,
            ethicaldesc: ethicaldesc, type: type, lastbought: lastbought,
            lastshown: lastshown, lastclick: lastclick, isAdmin: true
        }, context.req);
    }
    async getArticlePartnerList(name, brand, country, material, transport, price, ethical_score, ecological_score, local_score, type, lastbought, lastshown, lastclick, context) {
        return this.articlePartnerService.getArticlePartnerList({
            name,
            brand,
            country,
            material,
            transport,
            price,
            ethical_score,
            ecological_score,
            local_score,
            type,
            lastbought,
            lastshown,
            lastclick
        }, context.req);
    }
    async getArticlePartnerUserList(context) {
        return this.articlePartnerService.getArticlesByUserId(context.req);
    }
    async getAllArticlesPartner(context) {
        return this.articlePartnerService.getAllArticlesPartner();
    }
    async updateArticleLastClick(context, articleId) {
        return this.articlePartnerService.updateArticleLastClick(articleId);
    }
};
exports.ArticlePartnerResolver = ArticlePartnerResolver;
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerResponse),
    __param(0, (0, graphql_1.Args)('name')),
    __param(1, (0, graphql_1.Args)('redirection_url')),
    __param(2, (0, graphql_1.Args)({ name: 'material', type: () => [article_partner_model_2.CriteriaInputType] })),
    __param(3, (0, graphql_1.Args)({ name: 'country', type: () => [article_partner_model_2.CriteriaInputType] })),
    __param(4, (0, graphql_1.Args)({ name: 'transport', type: () => [article_partner_model_1.TransportInputType] })),
    __param(5, (0, graphql_1.Args)('price')),
    __param(6, (0, graphql_1.Args)('image')),
    __param(7, (0, graphql_1.Args)('description')),
    __param(8, (0, graphql_1.Args)('environnementdesc')),
    __param(9, (0, graphql_1.Args)('ethicaldesc')),
    __param(10, (0, graphql_1.Args)({ name: 'additionalCriteria', type: () => [criteria_model_1.AdditionalCriteria] })),
    __param(11, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, Array, Array, Number, String, String, String, String, Array, Object]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "createArticlePartner", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "deleteArticlePartner", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('name')),
    __param(2, (0, graphql_1.Args)('country')),
    __param(3, (0, graphql_1.Args)('material')),
    __param(4, (0, graphql_1.Args)('transport')),
    __param(5, (0, graphql_1.Args)('price')),
    __param(6, (0, graphql_1.Args)('image')),
    __param(7, (0, graphql_1.Args)('brandlogo')),
    __param(8, (0, graphql_1.Args)('description')),
    __param(9, (0, graphql_1.Args)('branddesc')),
    __param(10, (0, graphql_1.Args)('environnementdesc')),
    __param(11, (0, graphql_1.Args)('ethicaldesc')),
    __param(12, (0, graphql_1.Args)('type')),
    __param(13, (0, graphql_1.Args)('lastbought')),
    __param(14, (0, graphql_1.Args)('lastshown')),
    __param(15, (0, graphql_1.Args)('lastclick')),
    __param(16, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, Date,
        Date,
        Date, Object]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "updateArticlePartner", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => article_partner_model_1.ArticlePartnerResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('name')),
    __param(2, (0, graphql_1.Args)('brand')),
    __param(3, (0, graphql_1.Args)('country')),
    __param(4, (0, graphql_1.Args)('material')),
    __param(5, (0, graphql_1.Args)('transport')),
    __param(6, (0, graphql_1.Args)('price')),
    __param(7, (0, graphql_1.Args)('brandlogo')),
    __param(8, (0, graphql_1.Args)('description')),
    __param(9, (0, graphql_1.Args)('branddesc')),
    __param(10, (0, graphql_1.Args)('environnementdesc')),
    __param(11, (0, graphql_1.Args)('ethicaldesc')),
    __param(12, (0, graphql_1.Args)('type')),
    __param(13, (0, graphql_1.Args)('lastbought')),
    __param(14, (0, graphql_1.Args)('lastshown')),
    __param(15, (0, graphql_1.Args)('lastclick')),
    __param(16, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String,
        String,
        String, Object]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "updateArticlePartnerAdmin", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerListResponse),
    __param(0, (0, graphql_1.Args)('name', { defaultValue: null })),
    __param(1, (0, graphql_1.Args)('brand', { defaultValue: null })),
    __param(2, (0, graphql_1.Args)('country', { defaultValue: null })),
    __param(3, (0, graphql_1.Args)('material', { defaultValue: null })),
    __param(4, (0, graphql_1.Args)('transport', { defaultValue: null })),
    __param(5, (0, graphql_1.Args)('price', { defaultValue: null })),
    __param(6, (0, graphql_1.Args)('ethical_score', { defaultValue: null })),
    __param(7, (0, graphql_1.Args)('ecological_score', { defaultValue: null })),
    __param(8, (0, graphql_1.Args)('local_score', { defaultValue: null })),
    __param(9, (0, graphql_1.Args)('type', { defaultValue: null })),
    __param(10, (0, graphql_1.Args)('lastbought', { defaultValue: null })),
    __param(11, (0, graphql_1.Args)('lastshown', { defaultValue: null })),
    __param(12, (0, graphql_1.Args)('lastclick', { defaultValue: null })),
    __param(13, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, Date,
        Date,
        Date, Object]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "getArticlePartnerList", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerListResponse),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "getArticlePartnerUserList", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerListResponse),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "getAllArticlesPartner", null);
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerResponse),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ArticlePartnerResolver.prototype, "updateArticleLastClick", null);
exports.ArticlePartnerResolver = ArticlePartnerResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [article_partner_service_1.ArticlePartnerService])
], ArticlePartnerResolver);
//# sourceMappingURL=article.partner.resolver.js.map