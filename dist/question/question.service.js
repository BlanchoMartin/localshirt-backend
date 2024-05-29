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
var QuestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const typeorm_2 = require("typeorm");
const question_dto_1 = require("./dto/question.dto");
const question_entity_1 = require("../database/entities/question.entity");
const users_entity_1 = require("../database/entities/users.entity");
let QuestionService = QuestionService_1 = class QuestionService {
    constructor(logger, questionRepository, usersRepository) {
        this.logger = logger;
        this.questionRepository = questionRepository;
        this.usersRepository = usersRepository;
    }
    async create(body, req) {
        var _a, _b;
        let isOk = false;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return await new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:create:token)' });
                }
                const user = await this.usersRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (!user || !user.isDeveloper) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:create:isDeveloper)' });
                }
                const questionDTO = new question_dto_1.QuestionDTO();
                questionDTO.tag = body.tag;
                questionDTO.content = body.content;
                questionDTO.criteria_target = body.criteria_target;
                questionDTO.criteria_application = body.criteria_application;
                questionDTO.user_response_type = body.user_response_type;
                questionDTO.factor = body.factor;
                questionDTO.minimize = body.minimize;
                await (0, class_validator_1.validate)(questionDTO).then((errors) => {
                    if (errors.length > 0) {
                        this.logger.debug(`${errors}`, QuestionService_1.name);
                    }
                    else {
                        isOk = true;
                    }
                });
                if (isOk) {
                    const question = new question_entity_1.Question();
                    question.tag = questionDTO.tag;
                    question.content = questionDTO.content;
                    question.criteria_target = questionDTO.criteria_target;
                    question.criteria_application = questionDTO.criteria_application;
                    question.user_response_type = questionDTO.user_response_type;
                    question.factor = questionDTO.factor;
                    question.minimize = questionDTO.minimize;
                    try {
                        await this.questionRepository.save(question);
                    }
                    catch (err) {
                        this.logger.debug(err.message, QuestionService_1.name);
                        isOk = false;
                    }
                    if (isOk) {
                        return resolve({
                            status: common_1.HttpStatus.OK,
                            devMessage: 'OK',
                        });
                    }
                    else {
                        return resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:create:save)' });
                    }
                }
                else {
                    return resolve({ status: common_1.HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (QuestionService:create:DTO)' });
                }
            });
        });
    }
    async updateById(body, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                const user = await this.usersRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (err || !user || !user.isDeveloper) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:updateById:isDeveloper)' });
                }
                try {
                    const QuestionInfo = await this.questionRepository.findOne({
                        where: { id: body.id },
                    });
                    if (!QuestionInfo) {
                        return resolve({ status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (QuestionService:updateById:QuestionInfo)' });
                    }
                    const propertiesToUpdate = [
                        'tag',
                        'content',
                        'criteria_target',
                        'criteria_application',
                        'user_response_type',
                        'factor',
                        'extremum',
                        'minimize',
                    ];
                    propertiesToUpdate.forEach((property) => {
                        if (body[property] !== null) {
                            QuestionInfo[property] = body[property];
                        }
                    });
                    await this.questionRepository.save(QuestionInfo);
                    return resolve({ status: common_1.HttpStatus.OK, devMessage: 'OK' });
                }
                catch (error) {
                    console.error(error.message);
                    return resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:updateById:save)' });
                }
            });
        });
    }
    async updateByTag(body, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                const user = await this.usersRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (err || !user || !user.isDeveloper) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token' });
                }
                try {
                    const QuestionInfo = await this.questionRepository.findOne({
                        where: { tag: body.tag },
                    });
                    if (!QuestionInfo) {
                        return this.create(body, req);
                    }
                    const propertiesToUpdate = [
                        'content',
                        'criteria_target',
                        'criteria_application',
                        'user_response_type',
                        'factor',
                        'extremum',
                        'minimize',
                    ];
                    propertiesToUpdate.forEach((property) => {
                        if (body[property] !== null) {
                            QuestionInfo[property] = body[property];
                        }
                    });
                    await this.questionRepository.save(QuestionInfo);
                    return resolve({ status: common_1.HttpStatus.OK, devMessage: 'OK' });
                }
                catch (error) {
                    console.error(error.message);
                    return resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:updateByTag:save)' });
                }
            });
        });
    }
    async deleteById(id, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                const user = await this.usersRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (err || !user || !user.isDeveloper) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:deleteById:token)' });
                }
                try {
                    await this.questionRepository.delete(id);
                    return resolve({ status: common_1.HttpStatus.OK, devMessage: 'OK' });
                }
                catch (error) {
                    console.error(error.message);
                    return resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:deleteById:delete)' });
                }
            });
        });
    }
    async getByTag(tag, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                const user = await this.usersRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (err || !user || !user.isDeveloper) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:getByTag:isDeveloper)' });
                }
                try {
                    const elem = await this.questionRepository.findOne({ where: { tag: tag } });
                    if (!elem)
                        return resolve({
                            status: common_1.HttpStatus.NOT_FOUND,
                            devMessage: `Id not found`,
                        });
                    return resolve({
                        status: common_1.HttpStatus.OK,
                        devMessage: JSON.stringify(elem),
                    });
                }
                catch (error) {
                    console.error(error.message);
                    return resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:getByTag:elem)' });
                }
            });
        });
    }
    async getAll(req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    return resolve([]);
                }
                const user = await this.usersRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (!user || !user.isConfirmed) {
                    console.error(err);
                    return resolve([]);
                }
                try {
                    return resolve(await this.questionRepository.find());
                }
                catch (error) {
                    console.error(error.message);
                    return resolve([]);
                }
            });
        });
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = QuestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionService);
//# sourceMappingURL=question.service.js.map