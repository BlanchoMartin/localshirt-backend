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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
let Users = class Users {
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', nullable: true }),
    __metadata("design:type", Buffer)
], Users.prototype, "business_logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', nullable: true }),
    __metadata("design:type", Buffer)
], Users.prototype, "profil_picture", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessAdress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessZipCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Users.prototype, "businessLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Users.prototype, "isConfirmed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Users.prototype, "isDeveloper", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "confirmationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Users.prototype, "resetPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "resetPasswordReference", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)()
], Users);
//# sourceMappingURL=users.entity.js.map