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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlePartnerListResponse = exports.ImageReturn = exports.ArticlePartnerResponse = exports.ArticlePartnerStruct = exports.TransportInputType = exports.CriteriaInputType = exports.TransportObjectType = exports.CriteriaObjectType = void 0;
const graphql_1 = require("@nestjs/graphql");
let CriteriaObjectType = class CriteriaObjectType {
};
exports.CriteriaObjectType = CriteriaObjectType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CriteriaObjectType.prototype, "name", void 0);
exports.CriteriaObjectType = CriteriaObjectType = __decorate([
    (0, graphql_1.ObjectType)()
], CriteriaObjectType);
let TransportObjectType = class TransportObjectType {
};
exports.TransportObjectType = TransportObjectType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransportObjectType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TransportObjectType.prototype, "percent", void 0);
exports.TransportObjectType = TransportObjectType = __decorate([
    (0, graphql_1.ObjectType)()
], TransportObjectType);
let CriteriaInputType = class CriteriaInputType {
};
exports.CriteriaInputType = CriteriaInputType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CriteriaInputType.prototype, "name", void 0);
exports.CriteriaInputType = CriteriaInputType = __decorate([
    (0, graphql_1.InputType)()
], CriteriaInputType);
let TransportInputType = class TransportInputType {
};
exports.TransportInputType = TransportInputType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransportInputType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TransportInputType.prototype, "percent", void 0);
exports.TransportInputType = TransportInputType = __decorate([
    (0, graphql_1.InputType)()
], TransportInputType);
let ArticlePartnerStruct = class ArticlePartnerStruct {
};
exports.ArticlePartnerStruct = ArticlePartnerStruct;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "brand", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "redirection_url", void 0);
__decorate([
    (0, graphql_1.Field)(type => [CriteriaObjectType]),
    __metadata("design:type", Array)
], ArticlePartnerStruct.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(type => [CriteriaObjectType]),
    __metadata("design:type", Array)
], ArticlePartnerStruct.prototype, "material", void 0);
__decorate([
    (0, graphql_1.Field)(type => [TransportObjectType]),
    __metadata("design:type", Array)
], ArticlePartnerStruct.prototype, "transport", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "image", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "brandlogo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "environnementdesc", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "ethicaldesc", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "branddesc", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticlePartnerStruct.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.Int]),
    __metadata("design:type", Array)
], ArticlePartnerStruct.prototype, "rgb", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticlePartnerStruct.prototype, "ethical_score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticlePartnerStruct.prototype, "ecological_score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticlePartnerStruct.prototype, "local_score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerStruct.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ArticlePartnerStruct.prototype, "lastbought", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ArticlePartnerStruct.prototype, "lastshown", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ArticlePartnerStruct.prototype, "lastclick", void 0);
exports.ArticlePartnerStruct = ArticlePartnerStruct = __decorate([
    (0, graphql_1.ObjectType)()
], ArticlePartnerStruct);
let ArticlePartnerResponse = class ArticlePartnerResponse {
};
exports.ArticlePartnerResponse = ArticlePartnerResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticlePartnerResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerResponse.prototype, "devMessage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerResponse.prototype, "userMessage", void 0);
exports.ArticlePartnerResponse = ArticlePartnerResponse = __decorate([
    (0, graphql_1.ObjectType)()
], ArticlePartnerResponse);
let ImageReturn = class ImageReturn {
};
exports.ImageReturn = ImageReturn;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ImageReturn.prototype, "content", void 0);
exports.ImageReturn = ImageReturn = __decorate([
    (0, graphql_1.ObjectType)()
], ImageReturn);
let ArticlePartnerListResponse = class ArticlePartnerListResponse {
};
exports.ArticlePartnerListResponse = ArticlePartnerListResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticlePartnerListResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerListResponse.prototype, "devMessage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticlePartnerListResponse.prototype, "userMessage", void 0);
__decorate([
    (0, graphql_1.Field)((type) => [ArticlePartnerStruct]),
    __metadata("design:type", Array)
], ArticlePartnerListResponse.prototype, "articles", void 0);
exports.ArticlePartnerListResponse = ArticlePartnerListResponse = __decorate([
    (0, graphql_1.ObjectType)()
], ArticlePartnerListResponse);
//# sourceMappingURL=article.partner.model.js.map