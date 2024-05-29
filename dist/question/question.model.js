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
exports.InputQuestion = exports.Question = exports.QuestionResponse = void 0;
const graphql_1 = require("@nestjs/graphql");
let QuestionResponse = class QuestionResponse {
};
exports.QuestionResponse = QuestionResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], QuestionResponse.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], QuestionResponse.prototype, "devMessage", void 0);
exports.QuestionResponse = QuestionResponse = __decorate([
    (0, graphql_1.ObjectType)()
], QuestionResponse);
let Question = class Question {
};
exports.Question = Question;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Question.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Question.prototype, "tag", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Question.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Question.prototype, "criteria_target", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Question.prototype, "criteria_application", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Question.prototype, "user_response_type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Question.prototype, "factor", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Question.prototype, "minimize", void 0);
exports.Question = Question = __decorate([
    (0, graphql_1.ObjectType)()
], Question);
let InputQuestion = class InputQuestion {
};
exports.InputQuestion = InputQuestion;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], InputQuestion.prototype, "questionId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], InputQuestion.prototype, "criteria_application", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], InputQuestion.prototype, "user_response_type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], InputQuestion.prototype, "factor", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], InputQuestion.prototype, "minimize", void 0);
exports.InputQuestion = InputQuestion = __decorate([
    (0, graphql_1.InputType)()
], InputQuestion);
//# sourceMappingURL=question.model.js.map