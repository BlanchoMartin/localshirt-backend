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
exports.ArticleWebObject = exports.TransportInput = exports.MaterialInput = exports.CountryInput = exports.ArticleWebResponse = void 0;
const graphql_1 = require("@nestjs/graphql");
let ArticleWebResponse = class ArticleWebResponse {
};
exports.ArticleWebResponse = ArticleWebResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticleWebResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticleWebResponse.prototype, "devMessage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticleWebResponse.prototype, "userMessage", void 0);
exports.ArticleWebResponse = ArticleWebResponse = __decorate([
    (0, graphql_1.ObjectType)()
], ArticleWebResponse);
let CountryInput = class CountryInput {
};
exports.CountryInput = CountryInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CountryInput.prototype, "name", void 0);
exports.CountryInput = CountryInput = __decorate([
    (0, graphql_1.InputType)()
], CountryInput);
let MaterialInput = class MaterialInput {
};
exports.MaterialInput = MaterialInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MaterialInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MaterialInput.prototype, "percent", void 0);
exports.MaterialInput = MaterialInput = __decorate([
    (0, graphql_1.InputType)()
], MaterialInput);
let TransportInput = class TransportInput {
};
exports.TransportInput = TransportInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransportInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TransportInput.prototype, "percent", void 0);
exports.TransportInput = TransportInput = __decorate([
    (0, graphql_1.InputType)()
], TransportInput);
let CountryObject = class CountryObject {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CountryObject.prototype, "name", void 0);
CountryObject = __decorate([
    (0, graphql_1.ObjectType)()
], CountryObject);
let MaterialObject = class MaterialObject {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MaterialObject.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MaterialObject.prototype, "percent", void 0);
MaterialObject = __decorate([
    (0, graphql_1.ObjectType)()
], MaterialObject);
let TransportObject = class TransportObject {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransportObject.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TransportObject.prototype, "percent", void 0);
TransportObject = __decorate([
    (0, graphql_1.ObjectType)()
], TransportObject);
let ArticleWebObject = class ArticleWebObject {
};
exports.ArticleWebObject = ArticleWebObject;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticleWebObject.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticleWebObject.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticleWebObject.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticleWebObject.prototype, "image", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticleWebObject.prototype, "brand", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticleWebObject.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)(() => [CountryObject]),
    __metadata("design:type", Array)
], ArticleWebObject.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(() => [MaterialObject]),
    __metadata("design:type", Array)
], ArticleWebObject.prototype, "material", void 0);
__decorate([
    (0, graphql_1.Field)(() => [TransportObject]),
    __metadata("design:type", Array)
], ArticleWebObject.prototype, "transport", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticleWebObject.prototype, "ethical_score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticleWebObject.prototype, "ecological_score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticleWebObject.prototype, "local_score", void 0);
exports.ArticleWebObject = ArticleWebObject = __decorate([
    (0, graphql_1.ObjectType)()
], ArticleWebObject);
//# sourceMappingURL=article.web.model.js.map