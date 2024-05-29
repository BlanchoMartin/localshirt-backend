"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeScore = exports.reComputeCriteria = exports.ScoreApplication = void 0;
var ScoreApplication;
(function (ScoreApplication) {
    ScoreApplication["ECOLOGICAL"] = "ecological";
    ScoreApplication["ETHICAL"] = "ethical";
})(ScoreApplication || (exports.ScoreApplication = ScoreApplication = {}));
async function reComputeCriteria(criteriaRepository) {
    const criteriaList = await criteriaRepository.find();
    for (let i = 0; i < criteriaList.length; i++) {
        let score = await computeScore(criteriaList[i], ScoreApplication.ECOLOGICAL, criteriaRepository);
        criteriaList[i].ecological_score = score.score;
        score = await computeScore(criteriaList[i], ScoreApplication.ETHICAL, criteriaRepository);
        criteriaList[i].ethical_score = score.score;
        criteriaList[i].local_score = Math.floor((criteriaList[i].ecological_score + criteriaList[i].ethical_score) / 2);
        await criteriaRepository.update(criteriaList[i].id, criteriaList[i]);
    }
}
exports.reComputeCriteria = reComputeCriteria;
async function computeScore(newCriteria, application, criteriaRepository) {
    let totalFactor = 0;
    let score = 0;
    const criterionArr = JSON.parse(newCriteria.additionalCriteria).filter((elem) => elem.question.criteria_application == application ||
        elem.question.criteria_application == 'all');
    let recomputeTheOtherCriteria = false;
    for (let i = 0; i < criterionArr.length; i++) {
        switch (criterionArr[i].question.user_response_type) {
            case 'boolean':
                score +=
                    criterionArr[i].result == 'true'
                        ? criterionArr[i].question.factor * 100
                        : 0;
                totalFactor += criterionArr[i].question.factor;
                break;
            case 'range':
            case 'number':
                let min = null;
                let max = null;
                const criteriaRepositoryContent = await criteriaRepository.find();
                if (criteriaRepositoryContent)
                    criteriaRepositoryContent.forEach((criterion) => {
                        if (criterion.type != newCriteria.type)
                            return;
                        const criterionAdditionalCriteria = JSON.parse(criterion.additionalCriteria);
                        criterionAdditionalCriteria.forEach((additionalCriterion) => {
                            if (additionalCriterion.question.questionId ==
                                criterionArr[i].question.questionId)
                                try {
                                    if (min == null || Number(additionalCriterion.result) < min) {
                                        min = Number(additionalCriterion.result);
                                    }
                                    if (max == null || Number(additionalCriterion.result) > max) {
                                        max = Number(additionalCriterion.result);
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                        });
                    });
                try {
                    if (min == null || Number(criterionArr[i].result) < min) {
                        min = Number(criterionArr[i].result);
                        recomputeTheOtherCriteria = true;
                    }
                    if (max == null || Number(criterionArr[i].result) > max) {
                        max = Number(criterionArr[i].result);
                        recomputeTheOtherCriteria = true;
                    }
                }
                catch (err) {
                    console.error(err);
                }
                if (min >= max)
                    break;
                let subScore = ((Number(criterionArr[i].result) - min) * 100) / (max - min);
                if (criterionArr[i].question.minimize) {
                    subScore = 100 - subScore;
                }
                score += subScore * criterionArr[i].question.factor;
                totalFactor += criterionArr[i].question.factor;
                break;
            case 'criteria':
                if (!criteriaRepository)
                    break;
                const foundCriteria = await criteriaRepository.findOne({
                    where: { tag: criterionArr[i].result },
                });
                if (!foundCriteria)
                    break;
                score +=
                    criterionArr[i].question.factor *
                        foundCriteria[application + '_score'];
                totalFactor += criterionArr[i].question.factor;
            default:
                break;
        }
    }
    return { score: totalFactor > 0 ? Math.floor(score / totalFactor) : 0, needToRecomputeOther: recomputeTheOtherCriteria };
}
exports.computeScore = computeScore;
//# sourceMappingURL=computeScore.js.map