"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisModule = void 0;
const common_1 = require("@nestjs/common");
const analysis_service_1 = require("./analysis.service");
const analysis_resolver_1 = require("./analysis.resolver");
const article_partner_entity_1 = require("../database/entities/article.partner.entity");
const typeorm_1 = require("@nestjs/typeorm");
const scraper_service_1 = require("../scraper/scraper.service");
const article_partner_service_1 = require("../article/partner/article.partner.service");
const users_entity_1 = require("../database/entities/users.entity");
const logger_module_1 = require("../logger/logger.module");
const criteria_entity_1 = require("../database/entities/criteria.entity");
const article_web_service_1 = require("../article/web/article.web.service");
const article_web_entity_1 = require("../database/entities/article.web.entity");
let AnalysisModule = class AnalysisModule {
};
exports.AnalysisModule = AnalysisModule;
exports.AnalysisModule = AnalysisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            logger_module_1.LoggerModule,
            typeorm_1.TypeOrmModule.forFeature([
                article_partner_entity_1.ArticlePartner,
                users_entity_1.Users,
                criteria_entity_1.Criteria,
                article_web_entity_1.ArticleWeb,
            ]),
        ],
        controllers: [],
        providers: [
            analysis_service_1.AnalysisService,
            analysis_resolver_1.AnalysisResolver,
            scraper_service_1.ScraperService,
            article_partner_service_1.ArticlePartnerService,
            article_web_service_1.ArticleWebService,
        ],
        exports: [analysis_service_1.AnalysisService],
    })
], AnalysisModule);
//# sourceMappingURL=analysis.module.js.map