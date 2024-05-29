"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./database/entities/users.entity");
const auth_module_1 = require("./auth/auth.module");
const mail_module_1 = require("./mail/mail.module");
const article_partner_module_1 = require("./article/partner/article.partner.module");
const article_web_module_1 = require("./article/web/article.web.module");
const criteria_module_1 = require("./criteria/criteria.module");
const scraper_module_1 = require("./scraper/scraper.module");
const question_module_1 = require("./question/question.module");
const analysis_module_1 = require("./analysis/analysis.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
                context: ({ req }) => ({ req }),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT, 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [users_entity_1.Users],
                synchronize: false,
                autoLoadEntities: true,
            }),
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            article_partner_module_1.ArticlePartnerModule,
            article_web_module_1.ArticleWebModule,
            question_module_1.QuestionModule,
            analysis_module_1.AnalysisModule,
            scraper_module_1.ScraperModule,
            criteria_module_1.CriteriaModule,
        ],
        providers: [],
        controllers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map