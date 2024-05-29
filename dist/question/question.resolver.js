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
exports.QuestionResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const question_service_1 = require("./question.service");
const question_model_1 = require("./question.model");
let QuestionResolver = class QuestionResolver {
    constructor(questionService) {
        this.questionService = questionService;
    }
    async createQuestion(tag, content, criteria_target, criteria_application, user_response_type, factor, minimize, context) {
        return this.questionService.create({ tag, content, criteria_target, criteria_application, user_response_type, factor, minimize }, context.req);
    }
    async updateQuestionById(id, tag, content, criteria_target, criteria_application, user_response_type, factor, minimize, context) {
        return this.questionService.updateById({ id, tag, content, criteria_target, criteria_application, user_response_type, factor, minimize }, context.req);
    }
    async updateQuestionByTag(tag, content, criteria_target, criteria_application, user_response_type, factor, minimize, context) {
        return this.questionService.updateByTag({ tag, content, criteria_target, criteria_application, user_response_type, factor, minimize }, context.req);
    }
    async deleteQuestion(id, context) {
        return this.questionService.deleteById(id, context.req);
    }
    async getQuestionByTag(tag, context) {
        return this.questionService.getByTag(tag, context.req);
    }
    async getAllQuestions(context) {
        const questions = await this.questionService.getAll(context.req);
        return questions.map((question) => (Object.assign({}, question)));
    }
};
exports.QuestionResolver = QuestionResolver;
__decorate([
    (0, graphql_1.Query)((returns) => question_model_1.QuestionResponse),
    __param(0, (0, graphql_1.Args)('tag')),
    __param(1, (0, graphql_1.Args)('content')),
    __param(2, (0, graphql_1.Args)('criteria_target')),
    __param(3, (0, graphql_1.Args)('criteria_application')),
    __param(4, (0, graphql_1.Args)('user_response_type')),
    __param(5, (0, graphql_1.Args)('factor')),
    __param(6, (0, graphql_1.Args)('minimize')),
    __param(7, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number, Boolean, Object]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "createQuestion", null);
__decorate([
    (0, graphql_1.Query)((returns) => question_model_1.QuestionResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('tag', { defaultValue: null })),
    __param(2, (0, graphql_1.Args)('content', { defaultValue: null })),
    __param(3, (0, graphql_1.Args)('criteria_target', { defaultValue: null })),
    __param(4, (0, graphql_1.Args)('criteria_application', { defaultValue: null })),
    __param(5, (0, graphql_1.Args)('user_response_type', { defaultValue: null })),
    __param(6, (0, graphql_1.Args)('factor', { defaultValue: null })),
    __param(7, (0, graphql_1.Args)('minimize', { defaultValue: null })),
    __param(8, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Number, Boolean, Object]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "updateQuestionById", null);
__decorate([
    (0, graphql_1.Query)((returns) => question_model_1.QuestionResponse),
    __param(0, (0, graphql_1.Args)('tag')),
    __param(1, (0, graphql_1.Args)('content', { defaultValue: null })),
    __param(2, (0, graphql_1.Args)('criteria_target', { defaultValue: null })),
    __param(3, (0, graphql_1.Args)('criteria_application', { defaultValue: null })),
    __param(4, (0, graphql_1.Args)('user_response_type', { defaultValue: null })),
    __param(5, (0, graphql_1.Args)('factor', { defaultValue: null })),
    __param(6, (0, graphql_1.Args)('minimize', { defaultValue: null })),
    __param(7, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number, Boolean, Object]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "updateQuestionByTag", null);
__decorate([
    (0, graphql_1.Query)((returns) => question_model_1.QuestionResponse),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "deleteQuestion", null);
__decorate([
    (0, graphql_1.Query)((returns) => question_model_1.QuestionResponse),
    __param(0, (0, graphql_1.Args)('tag')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "getQuestionByTag", null);
__decorate([
    (0, graphql_1.Query)((returns) => [question_model_1.Question]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "getAllQuestions", null);
exports.QuestionResolver = QuestionResolver = __decorate([
    (0, graphql_1.Resolver)('Question'),
    __metadata("design:paramtypes", [question_service_1.QuestionService])
], QuestionResolver);
//# sourceMappingURL=question.resolver.js.map