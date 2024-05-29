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
exports.ArticlePartner = void 0;
const typeorm_1 = require("typeorm");
let ArticlePartner = class ArticlePartner {
};
exports.ArticlePartner = ArticlePartner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ArticlePartner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "redirection_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "transport", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "branddesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', nullable: true }),
    __metadata("design:type", Buffer)
], ArticlePartner.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', nullable: true }),
    __metadata("design:type", Buffer)
], ArticlePartner.prototype, "brandlogo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "ethicaldesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticlePartner.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "environnementdesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticlePartner.prototype, "ethical_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticlePartner.prototype, "ecological_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], ArticlePartner.prototype, "local_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'integer', array: true }),
    __metadata("design:type", Array)
], ArticlePartner.prototype, "rgb", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Date)
], ArticlePartner.prototype, "lastbought", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Date)
], ArticlePartner.prototype, "lastshown", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", Date)
], ArticlePartner.prototype, "lastclick", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], ArticlePartner.prototype, "image_data", void 0);
exports.ArticlePartner = ArticlePartner = __decorate([
    (0, typeorm_1.Entity)()
], ArticlePartner);
//# sourceMappingURL=article.partner.entity.js.map