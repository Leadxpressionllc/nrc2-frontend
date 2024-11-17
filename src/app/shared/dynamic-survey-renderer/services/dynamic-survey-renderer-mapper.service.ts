import { Survey, SurveyPage, SurveyQuestion } from '@core/models';
import { AppService } from '@core/utility-services';
import { DynamicInterlinkedQuestion, DynamicQuestion, DynamicQuestionOption } from '@shared/dynamic-question-renderer/models';
import { DynamicSurvey, DynamicSurveyPage } from '../model/dynamic-survey-renderer.model';
import { DynamicSurveyRendererService } from './dynamic-survey-renderer.service';

export class DynamicSurveyRendererMapperService {
  public static mapSurveyToDynamicSurvey(survey: Survey): DynamicSurvey {
    const { id, name, description, surveyPages, surveyAnswers, surveyFinishBtnText } = survey;

    // Initialize the DynamicSurvey object with basic properties
    const surveyData: DynamicSurvey = {
      id,
      name,
      description,
      incompletePageNumber: 0,
      isSurveyCompleted: false,
      surveyPages: this._getSurveyPages(surveyPages),
      surveyFinishBtnText,
    };

    if (!AppService.isUndefinedOrNull(surveyAnswers)) {
      // Create a Set of surveyQuestionIds for O(1) lookup time
      const surveyQuestionIdSet = new Set(surveyAnswers.map((sa) => sa.surveyQuestionId));

      // Find the index of the first incomplete page
      surveyData.incompletePageNumber = surveyData.surveyPages.findIndex((surveyPage, index) => {
        // Check if there are any unanswered visible questions on this page
        const hasUnansweredVisibleQuestions = surveyPage.questions.some(
          (question) =>
            // Check if the question is not answered and is visible
            !surveyQuestionIdSet.has(<string>question.surveyQuestionId) &&
            DynamicSurveyRendererService.isQuestionVisible(question, surveyAnswers)
        );

        // If there are unanswered visible questions, we've found the incomplete page
        if (hasUnansweredVisibleQuestions) {
          return true;
        }

        // If this is the last page and all questions are answered, mark the survey as completed
        if (index === surveyData.surveyPages.length - 1) {
          surveyData.isSurveyCompleted = true;
        }

        // Continue searching if this page is complete
        return false;
      });

      // If no incomplete page was found, set completedPageNumber to the last page
      if (surveyData.incompletePageNumber === -1) {
        surveyData.incompletePageNumber = surveyData.surveyPages.length - 1;
      }
    }

    return surveyData;
  }

  private static _getSurveyPages(surveyPages: SurveyPage[]): DynamicSurveyPage[] {
    const rendererSurveyPages: DynamicSurveyPage[] = [];

    surveyPages.forEach((page) => {
      rendererSurveyPages.push({ id: page.id, questions: this._getQuestions(page.surveyQuestions) });
    });

    return rendererSurveyPages;
  }

  private static _getQuestions(surveyQuestions: SurveyQuestion[]): DynamicQuestion[] {
    const questions: DynamicQuestion[] = [];

    surveyQuestions.forEach((surveyQuestion: SurveyQuestion) => {
      questions.push({
        id: surveyQuestion.question.id,
        surveyQuestionId: surveyQuestion.id,
        text: surveyQuestion.question.text,
        type: surveyQuestion.question.htmlElement,
        isRequired: false,
        hideQuestion: surveyQuestion.hideQuestion,
        sortOrder: surveyQuestion.sortOrder,
        questionOptions: this._getQuestionOptions(surveyQuestion),
        interlinkedQuestions: this._getInterlinkedQuestions(surveyQuestion),
        pixels: surveyQuestion.surveyQuestionPixels.map((sqp) => sqp.pixel),
      });
    });

    return questions;
  }

  private static _getQuestionOptions(surveyQuestion: SurveyQuestion): DynamicQuestionOption[] {
    const questionOptions: DynamicQuestionOption[] = [];

    surveyQuestion.question.questionOptions.forEach((questionOption) => {
      questionOptions.push({
        id: questionOption.id,
        text: questionOption.text,
        value: questionOption.value,
        sortOrder: questionOption.sortOrder,
      });
    });

    return questionOptions;
  }

  private static _getInterlinkedQuestions(surveyQuestion: SurveyQuestion): DynamicInterlinkedQuestion[] {
    const interlinkedQuestions: DynamicInterlinkedQuestion[] = [];

    if (!AppService.isUndefinedOrNull(surveyQuestion.interlinkedQuestions)) {
      surveyQuestion.interlinkedQuestions.forEach((interlinkedQuestion) => {
        const questionOptionIds: string[] = interlinkedQuestion.questionOptions.map((qo) => qo.id);

        interlinkedQuestions.push({
          id: interlinkedQuestion.id,
          surveyQuestionId: interlinkedQuestion.sourceSurveyQuestionId,
          questionOptions: questionOptionIds,
          questionType: surveyQuestion.question.htmlElement,
        });
      });
    }

    return interlinkedQuestions;
  }
}
