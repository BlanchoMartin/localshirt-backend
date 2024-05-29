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
exports.CriteriaResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const criteria_service_1 = require("./criteria.service");
const criteria_model_1 = require("./criteria.model");
let CriteriaResolver = class CriteriaResolver {
    constructor(criteriaService) {
        this.criteriaService = criteriaService;
    }
    async createCriteria(tag, type, additionalCriteria, context) {
        return this.criteriaService.create({ tag, type, additionalCriteria }, context.req);
    }
    async deleteCriteria(id, context) {
        return this.criteriaService.delete(id, context.req);
    }
    async updateCriteria(id, tag, production, end_life, independent_chemical, natural, life_duration, life_cycle, animals, context) {
        return this.criteriaService.update(id, { tag, production, end_life, independent_chemical, natural, life_duration, life_cycle, animals }, context.req);
    }
    async getAllCriteria(context) {
        return this.criteriaService.getAllCriteria();
    }
};
exports.CriteriaResolver = CriteriaResolver;
__decorate([
    (0, graphql_1.Query)((returns) => criteria_model_1.CriteriaResponse),
    __param(0, (0, graphql_1.Args)('tag')),
    __param(1, (0, graphql_1.Args)('type')),
    __param(2, (0, graphql_1.Args)({ name: 'additionalCriteria', type: () => [criteria_model_1.AdditionalCriteria] })),
    __param(3, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, Object]),
    __metadata("design:returntype", Promise)
], CriteriaResolver.prototype, "createCriteria", null);
__decorate([
    (0, graphql_1.Query)((returns) => criteria_model_1.CriteriaResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CriteriaResolver.prototype, "deleteCriteria", null);
__decorate([
    (0, graphql_1.Query)((returns) => criteria_model_1.CriteriaResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('tag')),
    __param(2, (0, graphql_1.Args)('production')),
    __param(3, (0, graphql_1.Args)('end_life')),
    __param(4, (0, graphql_1.Args)('independent_chemical')),
    __param(5, (0, graphql_1.Args)('natural')),
    __param(6, (0, graphql_1.Args)('life_duration')),
    __param(7, (0, graphql_1.Args)('life_cycle')),
    __param(8, (0, graphql_1.Args)('animals')),
    __param(9, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Boolean, Boolean, Boolean, Number, Boolean, Boolean, Object]),
    __metadata("design:returntype", Promise)
], CriteriaResolver.prototype, "updateCriteria", null);
__decorate([
    (0, graphql_1.Query)((returns) => criteria_model_1.CriteriaListResponse),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CriteriaResolver.prototype, "getAllCriteria", null);
exports.CriteriaResolver = CriteriaResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [criteria_service_1.CriteriaService])
], CriteriaResolver);
//# sourceMappingURL=criteria.resolver.js.map