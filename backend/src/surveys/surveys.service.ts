import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Option } from './entities/option.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { SurveyStats } from './dto/result-surveys';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>
  ) {}

  async findAll(): Promise<Survey[]> {
    return await this.surveyRepository.find({
      relations: ['questions', 'questions.options']
    });
  }

  async findOne(id: number): Promise<Survey> {
    return await this.surveyRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options']
    });
  }

  async findPublicSurveys(): Promise<Survey[]> {
    return this.surveyRepository.find({ where: { isPublic: true } });
  }

  async findPrivateSurveys(): Promise<Survey[]> {
    return this.surveyRepository.find({ where: { isPublic: false } });
  }

  async toggleVisibility(id: number, isPublic: boolean): Promise<Survey> {
    await this.surveyRepository.update(id, { isPublic });
    const survey = await this.surveyRepository.findOneBy({ id });
    if (!survey) {
    throw new Error(`Survey with id ${id} not found`);
  }
  return survey;
  }

  async createSurvey(createSurveyInput: CreateSurveyInput, user: User): Promise<Survey> {
    const { title, description, questions } = createSurveyInput;
    if (user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to create a survey.');
    };

    const survey = new Survey();
    survey.title = title;
    survey.description = description ?? null;
    survey.user = user

    const manager = this.surveyRepository.manager;
    return await manager.transaction(async (transactionalEntityManager: EntityManager) => {
      const savedSurvey = await transactionalEntityManager.save(Survey, survey);

      for (const questionInput of questions) {
        const question = new Question();
        question.text = questionInput.text;
        question.survey = savedSurvey;

        const savedQuestion = await transactionalEntityManager.save(Question, question);
        savedSurvey.questions = savedSurvey.questions ? [...savedSurvey.questions, savedQuestion] : [savedQuestion];

        for (const optionInput of questionInput.options) {
          const option = new Option();
          option.text = optionInput.text;
          option.question = savedQuestion;

          await transactionalEntityManager.save(Option, option);
          savedQuestion.options = savedQuestion.options ? [...savedQuestion.options, option] : [option];
        }
      }
      return savedSurvey;
    });
  };

  async getSurveyStats(surveyId: number): Promise<SurveyStats> {
    const totalResponses = await this.answerRepository.count({ where: { survey: { id: surveyId } } });

    const questions = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoin('survey.questions', 'question')
      .leftJoin('question.options', 'option')
      .leftJoin('option.answers', 'answer')
      .select([
        'question.id AS questionId',
        'question.text AS questionText',
        'option.id AS optionId',
        'option.text AS optionText',
        'COUNT(answer.id) AS responseCount',
      ])
      .where('survey.id = :surveyId', { surveyId })
      .groupBy('question.id, option.id')
      .getRawMany();

    const questionStats = questions.reduce((acc, curr) => {
      let question = acc.find((q) => q.id === curr.questionId);
      if (!question) {
        question = { id: curr.questionId, text: curr.questionText, options: [] };
        acc.push(question);
      }
      question.options.push({
        id: curr.optionId,
        text: curr.optionText,
        responseCount: parseInt(curr.responseCount, 10),
      });
      return acc;
    }, []);

    return {
      totalResponses,
      questions: questionStats,
    };
  }
}
