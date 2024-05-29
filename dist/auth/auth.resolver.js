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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const common_1 = require("@nestjs/common");
const auth_model_1 = require("./auth.model");
const jwt_auth_guard_1 = require("./strategy/jwt-auth.guard");
let AuthResolver = class AuthResolver {
    constructor(authService) {
        this.authService = authService;
    }
    async getAllUsers(context) {
        return await this.authService.findAll();
    }
    async login(email, password) {
        return this.authService.login({ email, password });
    }
    async register(email, password, name, lastName, businessRole, businessContact, businessName, business_logo, profil_picture, businessDescription, businessLink, context) {
        return this.authService.createUser({
            email,
            password,
            name,
            lastName,
            businessRole,
            businessContact,
            businessName,
            business_logo,
            profil_picture,
            businessDescription,
            businessLink
        }, context.req);
    }
    async confirm(token) {
        return this.authService.confirmRegistration(token);
    }
    async send_email_password(email, context) {
        return this.authService.send_email_password({ email }, context.req);
    }
    async forget_password(resetPasswordReference, password, confirm_password, context) {
        return this.authService.change_password({
            resetPasswordReference,
            password,
            confirm_password
        });
    }
    async profile(context) {
        return this.authService.getUser(context.req.user);
    }
    async delete_connected_user(context) {
        return this.authService.deleteUserConnected(context.req);
    }
    async user_ask_dev_perm(context) {
        return this.authService.userAskDev(context.req);
    }
    async confirmDev(token) {
        return this.authService.giveDevPermission(token);
    }
    async delete_user_by_id(id, context) {
        return this.authService.deleteByDeveloper(id, context.req);
    }
    async update_connected_user(name, lastName, businessRole, businessContact, businessName, businessAdress, businessZipCode, businessCity, businessCountry, isConfirmed, isDeveloper, businessDescription, business_logo, profil_picture, context) {
        return this.authService.updateConnectedUser({
            name,
            lastName,
            businessRole,
            businessContact,
            businessName,
            businessAdress,
            businessZipCode,
            businessCity,
            businessCountry,
            businessDescription,
            business_logo,
            profil_picture,
        }, context.req);
    }
    async updated_admin_user(id, email, name, lastName, businessRole, businessName, isConfirmed, isDeveloper, context) {
        return this.authService.UpdateUserByAdmin({
            name,
            email,
            lastName,
            businessRole,
            businessName,
            isConfirmed,
            isDeveloper,
        }, context.req);
    }
    async update_email_user_by_id(id, email, context) {
        return this.authService.updateEmailById(context.req, id, email);
    }
    async get_companies() {
        return await this.authService.getCompanies();
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.UserListResponse),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "getAllUsers", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Args)('password')),
    __param(2, (0, graphql_1.Args)('name')),
    __param(3, (0, graphql_1.Args)('lastName')),
    __param(4, (0, graphql_1.Args)('businessRole')),
    __param(5, (0, graphql_1.Args)('businessContact')),
    __param(6, (0, graphql_1.Args)('businessName')),
    __param(7, (0, graphql_1.Args)('business_logo')),
    __param(8, (0, graphql_1.Args)('profil_picture')),
    __param(9, (0, graphql_1.Args)('businessDescription')),
    __param(10, (0, graphql_1.Args)('businessLink')),
    __param(11, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "confirm", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "send_email_password", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('resetPasswordReference')),
    __param(1, (0, graphql_1.Args)('password')),
    __param(2, (0, graphql_1.Args)('confirm_password')),
    __param(3, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "forget_password", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, graphql_1.Query)((returns) => auth_model_1.UserAuthResponse),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "profile", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "delete_connected_user", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "user_ask_dev_perm", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "confirmDev", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "delete_user_by_id", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('name', { defaultValue: 'null' })),
    __param(1, (0, graphql_1.Args)('lastName', { defaultValue: 'null' })),
    __param(2, (0, graphql_1.Args)('businessRole', { defaultValue: 'null' })),
    __param(3, (0, graphql_1.Args)('businessContact', { defaultValue: 'null' })),
    __param(4, (0, graphql_1.Args)('businessName', { defaultValue: 'null' })),
    __param(5, (0, graphql_1.Args)('businessAdress', { defaultValue: 'null' })),
    __param(6, (0, graphql_1.Args)('businessZipCode', { defaultValue: 'null' })),
    __param(7, (0, graphql_1.Args)('businessCity', { defaultValue: 'null' })),
    __param(8, (0, graphql_1.Args)('businessCountry', { defaultValue: 'null' })),
    __param(9, (0, graphql_1.Args)('isConfirmed', { defaultValue: false })),
    __param(10, (0, graphql_1.Args)('isDeveloper', { defaultValue: false })),
    __param(11, (0, graphql_1.Args)('businessDescription', { defaultValue: 'null' })),
    __param(12, (0, graphql_1.Args)('business_logo', { defaultValue: 'null' })),
    __param(13, (0, graphql_1.Args)('profil_picture', { defaultValue: 'null' })),
    __param(14, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, Boolean, Boolean, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "update_connected_user", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('id', { defaultValue: "null" })),
    __param(1, (0, graphql_1.Args)('email', { defaultValue: 'null' })),
    __param(2, (0, graphql_1.Args)('name', { defaultValue: 'null' })),
    __param(3, (0, graphql_1.Args)('lastName', { defaultValue: 'null' })),
    __param(4, (0, graphql_1.Args)('businessRole', { defaultValue: 'null' })),
    __param(5, (0, graphql_1.Args)('businessName', { defaultValue: 'null' })),
    __param(6, (0, graphql_1.Args)('isConfirmed', { defaultValue: false })),
    __param(7, (0, graphql_1.Args)('isDeveloper', { defaultValue: false })),
    __param(8, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Boolean, Boolean, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "updated_admin_user", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('email')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "update_email_user_by_id", null);
__decorate([
    (0, graphql_1.Query)((returns) => auth_model_1.CompaniesListResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "get_companies", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map