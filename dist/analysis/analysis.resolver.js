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
exports.AnalysisResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const analysis_service_1 = require("./analysis.service");
const article_partner_model_1 = require("../article/partner/article.partner.model");
let AnalysisResolver = class AnalysisResolver {
    constructor(AnalysisService) {
        this.AnalysisService = AnalysisService;
    }
    async findAlternative(URL, likeliness, minPrice, maxPrice) {
        return await this.AnalysisService.findAlternative(URL, likeliness, minPrice, maxPrice);
    }
    async findAlternativeByImage(image, minPrice, maxPrice, likeliness) {
        return await this.AnalysisService.findAlternativebyImage(image, minPrice, maxPrice, likeliness);
    }
};
exports.AnalysisResolver = AnalysisResolver;
__decorate([
    (0, graphql_1.Query)((returns) => article_partner_model_1.ArticlePartnerListResponse),
    __param(0, (0, graphql_1.Args)('URL')),
    __param(1, (0, graphql_1.Args)('likeliness')),
    __param(2, (0, graphql_1.Args)('minPrice')),
    __param(3, (0, graphql_1.Args)('maxPrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AnalysisResolver.prototype, "findAlternative", null);
__decorate([
    (0, graphql_1.Mutation)(() => article_partner_model_1.ArticlePartnerListResponse),
    __param(0, (0, graphql_1.Args)('image')),
    __param(1, (0, graphql_1.Args)("minPrice")),
    __param(2, (0, graphql_1.Args)("maxPrice")),
    __param(3, (0, graphql_1.Args)("likeliness")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AnalysisResolver.prototype, "findAlternativeByImage", null);
exports.AnalysisResolver = AnalysisResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [analysis_service_1.AnalysisService])
], AnalysisResolver);
//# sourceMappingURL=analysis.resolver.js.map