"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const logger_module_1 = require("../logger/logger.module");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const question_service_1 = require("./question.service");
const question_resolver_1 = require("./question.resolver");
const passport_1 = require("@nestjs/passport");
const question_entity_1 = require("../database/entities/question.entity");
const users_entity_1 = require("../database/entities/users.entity");
let QuestionModule = class QuestionModule {
};
exports.QuestionModule = QuestionModule;
exports.QuestionModule = QuestionModule = __decorate([
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
            typeorm_1.TypeOrmModule.forFeature([question_entity_1.Question, users_entity_1.Users]),
        ],
        providers: [question_service_1.QuestionService, question_resolver_1.QuestionResolver],
        exports: [question_service_1.QuestionService],
    })
], QuestionModule);
//# sourceMappingURL=question.module.js.map