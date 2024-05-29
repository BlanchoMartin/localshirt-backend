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
exports.UserListResponse = exports.UserAuthResponse = exports.User = exports.CompaniesListResponse = exports.Company = exports.AuthResponse = exports.Message = void 0;
const graphql_1 = require("@nestjs/graphql");
let Message = class Message {
};
exports.Message = Message;
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "access_token", void 0);
exports.Message = Message = __decorate([
    (0, graphql_1.ObjectType)()
], Message);
let AuthResponse = class AuthResponse {
};
exports.AuthResponse = AuthResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], AuthResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthResponse.prototype, "devMessage", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AuthResponse.prototype, "userMessage", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Message)
], AuthResponse.prototype, "content", void 0);
exports.AuthResponse = AuthResponse = __decorate([
    (0, graphql_1.ObjectType)()
], AuthResponse);
let Company = class Company {
};
exports.Company = Company;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "logo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "businessLink", void 0);
exports.Company = Company = __decorate([
    (0, graphql_1.ObjectType)()
], Company);
let CompaniesListResponse = class CompaniesListResponse {
};
exports.CompaniesListResponse = CompaniesListResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CompaniesListResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CompaniesListResponse.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)((type) => [Company]),
    __metadata("design:type", Array)
], CompaniesListResponse.prototype, "companies", void 0);
exports.CompaniesListResponse = CompaniesListResponse = __decorate([
    (0, graphql_1.ObjectType)()
], CompaniesListResponse);
let User = class User {
};
exports.User = User;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessRole", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessContact", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessAdress", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessZipCode", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessCity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessCountry", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessDescription", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isConfirmed", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeveloper", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "business_logo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "profil_picture", void 0);
exports.User = User = __decorate([
    (0, graphql_1.ObjectType)()
], User);
let UserAuthResponse = class UserAuthResponse {
};
exports.UserAuthResponse = UserAuthResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], UserAuthResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserAuthResponse.prototype, "devMessage", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserAuthResponse.prototype, "userMessage", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", User)
], UserAuthResponse.prototype, "user", void 0);
exports.UserAuthResponse = UserAuthResponse = __decorate([
    (0, graphql_1.ObjectType)()
], UserAuthResponse);
let UserListResponse = class UserListResponse {
};
exports.UserListResponse = UserListResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], UserListResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => [User]),
    __metadata("design:type", Array)
], UserListResponse.prototype, "users", void 0);
exports.UserListResponse = UserListResponse = __decorate([
    (0, graphql_1.ObjectType)()
], UserListResponse);
//# sourceMappingURL=auth.model.js.map