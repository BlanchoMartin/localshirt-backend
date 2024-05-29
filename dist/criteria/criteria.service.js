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
exports.CriteriaService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const typeorm_2 = require("typeorm");
const criteria_dto_1 = require("./dto/criteria.dto");
const criteria_entity_1 = require("../database/entities/criteria.entity");
const users_entity_1 = require("../database/entities/users.entity");
const computeScore_1 = require("../article/computeScore");
let CriteriaService = class CriteriaService {
    constructor(logger, criteriaRepository, userRepository) {
        this.logger = logger;
        this.criteriaRepository = criteriaRepository;
        this.userRepository = userRepository;
    }
    async create(body, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            var _a, _b;
            const jwt = require('jsonwebtoken');
            const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, '123456');
            }
            catch (err) {
                console.error(err);
                return { status: common_1.HttpStatus.FORBIDDEN, devMessage: "Invalid token (CriteriaService:create:decodedToken)", userMessage: "Vous n'avez pas les autorisations nécessaires pour effectuer cette action." };
            }
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:create:token)' });
                }
                const userInfo = await this.userRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (userInfo && userInfo.isDeveloper === true) {
                    const criteriaDTO = new criteria_dto_1.CriteriaDTO();
                    criteriaDTO.tag = body.tag;
                    criteriaDTO.type = body.type;
                    criteriaDTO.additionalCriteria = JSON.stringify(body.additionalCriteria);
                    const errors = await (0, class_validator_1.validate)(criteriaDTO);
                    if (errors.length > 0) {
                        console.error(errors);
                        return resolve({ status: common_1.HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (CriteriaService:create:DTO)' });
                    }
                    let needRecomputeCriteria = false;
                    const criteria = new criteria_entity_1.Criteria();
                    criteria.tag = criteriaDTO.tag;
                    criteria.type = criteriaDTO.type;
                    criteria.additionalCriteria = criteriaDTO.additionalCriteria;
                    let score = await (0, computeScore_1.computeScore)(criteria, computeScore_1.ScoreApplication.ECOLOGICAL, this.criteriaRepository);
                    criteria.ecological_score = score.score;
                    needRecomputeCriteria =
                        score.needToRecomputeOther || needRecomputeCriteria;
                    score = await (0, computeScore_1.computeScore)(criteria, computeScore_1.ScoreApplication.ETHICAL, this.criteriaRepository);
                    criteria.ethical_score = score.score;
                    needRecomputeCriteria =
                        score.needToRecomputeOther || needRecomputeCriteria;
                    criteria.local_score = Math.floor((criteria.ecological_score + criteria.ethical_score) / 2);
                    try {
                        await this.criteriaRepository.save(criteria);
                        if (needRecomputeCriteria)
                            await (0, computeScore_1.reComputeCriteria)(this.criteriaRepository);
                        return resolve({
                            status: common_1.HttpStatus.OK,
                            devMessage: 'OK',
                        });
                    }
                    catch (error) {
                        console.error(error.message);
                        return resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:create:save)' });
                    }
                }
                else {
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:create:isDeveloper)' });
                }
            });
        });
    }
    async delete(id, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise((resolve, reject) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:delete:token)' });
                }
                const userInfo = await this.userRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (userInfo && userInfo.isDeveloper === true) {
                    try {
                        const deleteResult = await this.criteriaRepository.delete(id);
                        if (deleteResult.affected === 0) {
                            resolve({ status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (CriteriaService:delete:delete)' });
                        }
                        else {
                            resolve({
                                status: common_1.HttpStatus.OK,
                                devMessage: 'OK',
                            });
                        }
                    }
                    catch (error) {
                        console.error(error);
                        resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:delete:catch)' });
                    }
                }
                else {
                    resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:delete:isDeveloper)' });
                }
            });
        });
    }
    async update(id, body, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    return resolve({ status: common_1.HttpStatus.BAD_REQUEST, devMessage: 'Invalid token (CriteriaService:update:token)' });
                }
                const userInfo = await this.userRepository.findOne({
                    where: { email: decodedToken.email },
                });
                if (userInfo && userInfo.isDeveloper === true) {
                    const criteriaDTO = new criteria_dto_1.CriteriaDTO();
                    criteriaDTO.tag = body.tag;
                    criteriaDTO.type = body.type;
                    const errors = await (0, class_validator_1.validate)(criteriaDTO);
                    if (errors.length > 0) {
                        console.error(errors);
                        return resolve({ status: common_1.HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (CriteriaService:update:DTO)' });
                    }
                    try {
                        const criteria = await this.criteriaRepository.findOne({
                            where: {
                                id: id,
                            },
                        });
                        if (!criteria) {
                            return resolve({ status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (CriteriaService:criteria)' });
                        }
                        criteria.tag = body.tag;
                        criteria.type = body.type;
                        await this.criteriaRepository.save(criteria);
                        return resolve({
                            status: common_1.HttpStatus.OK,
                            devMessage: 'OK',
                        });
                    }
                    catch (error) {
                        console.error(error);
                        return resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:update:save)' });
                    }
                }
                else {
                    return resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:update:catch)' });
                }
            });
        });
    }
    async getAllCriteria() {
        const criteriaList = await this.criteriaRepository.find();
        if (!criteriaList)
            return { status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:getAllCriteria:find)', criteria: [] };
        return {
            status: common_1.HttpStatus.OK,
            devMessage: 'OK',
            criteria: criteriaList,
        };
    }
};
exports.CriteriaService = CriteriaService;
exports.CriteriaService = CriteriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(criteria_entity_1.Criteria)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CriteriaService);
//# sourceMappingURL=criteria.service.js.map