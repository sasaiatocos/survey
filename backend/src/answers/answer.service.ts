import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { User } from '../users/entities/user.entity';
import { Question, QuestionType } from '../surveys/entities/question.entity';
import { Option } from '../surveys/entities/option.entity';
import { Survey } from '../surveys/entities/survey.entity';
import { AnswerInput } from './dto/answer.input';
import { SurveyAnswer } from '../entities/survey-answer.entity';
import { AnswerOption } from '../entities/answer-option.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(SurveyAnswer)
    private surveyAnswerRepository: Repository<SurveyAnswer>,
    @InjectRepository(AnswerOption)
    private answerOptionRepository: Repository<AnswerOption>,
  ) { }

  async submitAnswer(answers: AnswerInput[]): Promise<Answer[]> {
    const savedAnswers: Answer[] = [];
    const answeredSurveys = new Set<number>();

    if (!answers || answers.length === 0) {
      throw new BadRequestException('回答が送信されていません');
    }
    const surveyId = answers[0].surveyId;
    const survey = await this.surveyRepository.findOne({ where: { id: surveyId }, relations: ['questions'] });
    if (!survey) throw new NotFoundException('アンケートが見つかりませんでした');

    const allQuestionsAnswered = survey.questions.every((question) => {
      const answer = answers.find((a) => a.questionId === question.id);
      if (question.type === QuestionType.OPEN_ENDED) {
        return answer && answer.textResponse && answer.textResponse.trim() !== '';
      } else {
        return answer && answer.optionIds && answer.optionIds.length > 0;
      }
    });

    if (!allQuestionsAnswered) {
      throw new BadRequestException('すべての質問に回答してください');
    }
    for (const answerInput of answers) {
      await this.validateAnswerInput(answerInput, answeredSurveys);
      const savedAnswersArray = await this.saveAnswer(answerInput);
      savedAnswers.push(...savedAnswersArray);
    }
    return savedAnswers;
  }

  private async validateAnswerInput(answerInput: AnswerInput, answeredSurveys: Set<number>): Promise<void> {
    const { surveyId, questionId, optionIds, textResponse, userId } = answerInput;

    const survey = await this.surveyRepository.findOne({ where: { id: surveyId }, relations: ['questions'] });
    if (!survey) throw new NotFoundException('アンケートが見つかりませんでした');

    if (!answeredSurveys.has(surveyId)) {
      const existingAnswer = await this.surveyAnswerRepository.findOne({
        where: { survey: { id: surveyId }, answer: { user: { id: userId } } },
        relations: ['answer']
      });
      if (existingAnswer) throw new ForbiddenException('このアンケートはすでに回答済みです');
      answeredSurveys.add(surveyId);
    }

    const question = await this.questionRepository.findOne({ where: { id: questionId, survey: { id: surveyId } } });
    if (!question) throw new NotFoundException('質問が見つかりませんでした');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('このユーザーは存在しません');

    if (question.type === QuestionType.OPEN_ENDED) {
      if (!textResponse || textResponse.trim() === '')
        throw new BadRequestException('自由記述の回答が必要です');
    } else {
      if (!optionIds || optionIds.length === 0)
        throw new BadRequestException('選択肢を選択してください');
      if (question.type === QuestionType.SINGLE_CHOICE && optionIds.length > 1)
        throw new BadRequestException('YES/NOの質問には1つの選択肢のみ選択してください');
    }
  }

  private async saveAnswer(answerInput: AnswerInput): Promise<Answer[]> {
    const { surveyId, questionId, optionIds, textResponse, userId } = answerInput;

    const survey = await this.surveyRepository.findOne({ where: { id: surveyId } });
    const question = await this.questionRepository.findOne({ where: { id: questionId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (question.type === QuestionType.OPEN_ENDED) {
      const answer = new Answer();
      answer.question = question;
      answer.user = user;
      answer.textResponse = textResponse;
      const savedAnswer = await this.answerRepository.save(answer);

      const surveyAnswer = new SurveyAnswer();
      surveyAnswer.survey = survey;
      surveyAnswer.answer = savedAnswer;
      await this.surveyAnswerRepository.save(surveyAnswer);

      return [savedAnswer];
    } else {
      const savedAnswers: Answer[] = [];
      for (const optionId of optionIds) {
        const selectedOption = await this.optionRepository.findOne({ where: { id: optionId, question: { id: questionId } } });
        const answer = new Answer();
        answer.question = question;
        answer.user = user;
        const savedAnswer = await this.answerRepository.save(answer);

        const surveyAnswer = new SurveyAnswer();
        surveyAnswer.survey = survey;
        surveyAnswer.answer = savedAnswer;
        await this.surveyAnswerRepository.save(surveyAnswer);

        const answerOption = new AnswerOption();
        answerOption.answer = savedAnswer;
        answerOption.option = selectedOption;
        await this.answerOptionRepository.save(answerOption);

        savedAnswers.push(savedAnswer);
      }
      return savedAnswers;
    }
  }
}