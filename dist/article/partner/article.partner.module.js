"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlePartnerModule = void 0;
const common_1 = require("@nestjs/common");
const article_partner_resolver_1 = require("./article.partner.resolver");
const article_partner_service_1 = require("./article.partner.service");
const passport_1 = require("@nestjs/passport");
const logger_module_1 = require("../../logger/logger.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const article_partner_entity_1 = require("../../database/entities/article.partner.entity");
const users_entity_1 = require("../../database/entities/users.entity");
const criteria_entity_1 = require("../../database/entities/criteria.entity");
let ArticlePartnerModule = class ArticlePartnerModule {
};
exports.ArticlePartnerModule = ArticlePartnerModule;
exports.ArticlePartnerModule = ArticlePartnerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            logger_module_1.LoggerModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    return {
                        global: true,
                        secret: configService.get('keys.secret'),
                        signOptions: { expiresIn: '60s' },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                article_partner_entity_1.ArticlePartner,
                users_entity_1.Users,
                criteria_entity_1.Criteria,
            ]),
        ],
        providers: [article_partner_service_1.ArticlePartnerService, article_partner_resolver_1.ArticlePartnerResolver],
        exports: [article_partner_service_1.ArticlePartnerService],
    })
], ArticlePartnerModule);
//# sourceMappingURL=article.partner.module.js.map