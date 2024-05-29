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
exports.AdditionalCriteria = exports.CriteriaListResponse = exports.CriteriaStruct = exports.CriteriaResponse = void 0;
const graphql_1 = require("@nestjs/graphql");
const question_model_1 = require("../question/question.model");
let CriteriaResponse = class CriteriaResponse {
};
exports.CriteriaResponse = CriteriaResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CriteriaResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CriteriaResponse.prototype, "devMessage", void 0);
exports.CriteriaResponse = CriteriaResponse = __decorate([
    (0, graphql_1.ObjectType)()
], CriteriaResponse);
let CriteriaStruct = class CriteriaStruct {
};
exports.CriteriaStruct = CriteriaStruct;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CriteriaStruct.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CriteriaStruct.prototype, "tag", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CriteriaStruct.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CriteriaStruct.prototype, "ethical_score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CriteriaStruct.prototype, "ecological_score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CriteriaStruct.prototype, "local_score", void 0);
exports.CriteriaStruct = CriteriaStruct = __decorate([
    (0, graphql_1.ObjectType)()
], CriteriaStruct);
let CriteriaListResponse = class CriteriaListResponse {
};
exports.CriteriaListResponse = CriteriaListResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CriteriaListResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CriteriaListResponse.prototype, "devMessage", void 0);
__decorate([
    (0, graphql_1.Field)(type => [CriteriaStruct]),
    __metadata("design:type", Array)
], CriteriaListResponse.prototype, "criteria", void 0);
exports.CriteriaListResponse = CriteriaListResponse = __decorate([
    (0, graphql_1.ObjectType)()
], CriteriaListResponse);
let AdditionalCriteria = class AdditionalCriteria {
};
exports.AdditionalCriteria = AdditionalCriteria;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdditionalCriteria.prototype, "result", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", question_model_1.InputQuestion)
], AdditionalCriteria.prototype, "question", void 0);
exports.AdditionalCriteria = AdditionalCriteria = __decorate([
    (0, graphql_1.InputType)()
], AdditionalCriteria);
//# sourceMappingURL=criteria.model.js.map