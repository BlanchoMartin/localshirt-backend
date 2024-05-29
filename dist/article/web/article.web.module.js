"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleWebModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const logger_module_1 = require("../../logger/logger.module");
const article_web_entity_1 = require("../../database/entities/article.web.entity");
const article_web_service_1 = require("./article.web.service");
const article_web_resolver_1 = require("./article.web.resolver");
const criteria_entity_1 = require("../../database/entities/criteria.entity");
const schedule_1 = require("@nestjs/schedule");
let ArticleWebModule = class ArticleWebModule {
};
exports.ArticleWebModule = ArticleWebModule;
exports.ArticleWebModule = ArticleWebModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
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
            typeorm_1.TypeOrmModule.forFeature([article_web_entity_1.ArticleWeb, criteria_entity_1.Criteria]),
        ],
        providers: [article_web_service_1.ArticleWebService, article_web_resolver_1.ArticleWebResolver],
        exports: [article_web_service_1.ArticleWebService],
    })
], ArticleWebModule);
//# sourceMappingURL=article.web.module.js.map