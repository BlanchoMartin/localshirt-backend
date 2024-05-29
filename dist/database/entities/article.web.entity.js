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
exports.ArticleWeb = void 0;
const typeorm_1 = require("typeorm");
let ArticleWeb = class ArticleWeb {
};
exports.ArticleWeb = ArticleWeb;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ArticleWeb.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: true }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', nullable: true }),
    __metadata("design:type", Buffer)
], ArticleWeb.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticleWeb.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "transport", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticleWeb.prototype, "ethical_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticleWeb.prototype, "ecological_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticleWeb.prototype, "local_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Date)
], ArticleWeb.prototype, "creation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticleWeb.prototype, "image_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'integer', array: true }),
    __metadata("design:type", Array)
], ArticleWeb.prototype, "rgb", void 0);
exports.ArticleWeb = ArticleWeb = __decorate([
    (0, typeorm_1.Entity)()
], ArticleWeb);
//# sourceMappingURL=article.web.entity.js.map