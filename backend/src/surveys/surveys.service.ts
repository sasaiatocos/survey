import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question, QuestionType } from './entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Option } from './entities/option.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { SurveyStats } from './dto/result-surveys';
import { SurveyAnswer } from '../entities/survey-answer.entity';
import { UserSurvey } from '../entities/user-survey.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(SurveyAnswer)
    private surveyAnswerRepository: Repository<SurveyAnswer>,
    @InjectRepository(UserSurvey)
    private userSurveyRepository: Repository<UserSurvey>,
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

  async getMySurveys(user: User): Promise<Survey[]> {
    const surveys = await this.surveyRepository
    .createQueryBuilder('survey')
    .leftJoin('user_surveys', 'userSurvey', 'userSurvey.surveyId = survey.id')
    .leftJoinAndSelect('survey.questions', 'question')
    .leftJoinAndSelect('question.options', 'option')
    .where('userSurvey.userId = :userId', { userId: user.id })
    .getMany();
    return surveys;
  }

  async findPublicSurveys(): Promise<Survey[]> {
    return this.surveyRepository.find({ where: { isPublic: true } });
  }

  async findPrivateSurveys(): Promise<Survey[]> {
    return this.surveyRepository.find({ where: { isPublic: false } });
  }

  async toggleSurveyVisibility(id: number, isPublic: boolean): Promise<Survey> {
    const updateResult = await this.surveyRepository.update(id, { isPublic });
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Survey with id ${id} not found`);
    }
    return this.surveyRepository.findOneBy({ id });
  }

  async createSurvey(createSurveyInput: CreateSurveyInput, user: User): Promise<Survey> {
    const { title, description, questions } = createSurveyInput;
    if (user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to create a survey.');
    };

    const survey = new Survey();
    survey.title = title;
    survey.description = description ?? null;

    const manager = this.surveyRepository.manager;
    return await manager.transaction(async (transactionalEntityManager: EntityManager) => {
      const savedSurvey = await transactionalEntityManager.save(Survey, survey);

      const userSurvey = new UserSurvey();
      userSurvey.user = user;
      userSurvey.survey = savedSurvey;
      await transactionalEntityManager.save(UserSurvey, userSurvey);

      for (const questionInput of questions) {
        const question = new Question();
        question.text = questionInput.text;
        question.type = questionInput.type;
        question.survey = savedSurvey;

        const savedQuestion = await transactionalEntityManager.save(Question, question);
        savedSurvey.questions = savedSurvey.questions ? [...savedSurvey.questions, savedQuestion] : [savedQuestion];

        if (questionInput.type === QuestionType.OPEN_ENDED) {
          savedQuestion.options = null;
          await transactionalEntityManager.save(Question, savedQuestion);
          continue;
        }

        const hasOptions = questionInput.options && questionInput.options.length > 0;
        const isChoiceType = questionInput.type === QuestionType.SINGLE_CHOICE || questionInput.type === QuestionType.MULTIPLE_CHOICE;
        const optionsToSave = isChoiceType && hasOptions ? questionInput.options : null;

        if (optionsToSave && Array.isArray(optionsToSave)) {
          savedQuestion.options = [];
          for (const optionInput of optionsToSave) {
            const option = new Option();
            option.text = optionInput.text;
            option.question = savedQuestion;

            await transactionalEntityManager.save(Option, option);
            savedQuestion.options.push(option);
          }
          await transactionalEntityManager.save(Question, savedQuestion);
        } else {
          savedQuestion.options = [];
          await transactionalEntityManager.save(Question, savedQuestion);
        }
        const questionIndex = savedSurvey.questions.findIndex(q => q.id === savedQuestion.id);
        if (questionIndex !== -1) {
          savedSurvey.questions[questionIndex].options = savedQuestion.options;
          savedSurvey.questions[questionIndex] = savedQuestion;
        }
      }
      return savedSurvey;
    });
  };

  async getSurveyStats(surveyId: number): Promise<SurveyStats> {
    const totalResponses = await this.surveyAnswerRepository.count({ where: { survey: { id: surveyId } } });

    const uniqueRespondentsResult = await this.surveyAnswerRepository
      .createQueryBuilder('surveyAnswer')
      .leftJoin('surveyAnswer.answer', 'answer')
      .leftJoin('answer.user', 'user')
      .select('COUNT(DISTINCT user.id)', 'count')
      .where('surveyAnswer.surveyId = :surveyId', { surveyId })
      .getRawOne();

    const uniqueRespondents = uniqueRespondentsResult ? parseInt(uniqueRespondentsResult.count, 10) : 0;

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
      uniqueRespondents,
      questions: questionStats,
    };
  }
}
