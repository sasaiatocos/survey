import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Option } from './entities/option.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { OptionCount } from './dto/option-count.output';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
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

  async createSurvey(createSurveyInput: CreateSurveyInput, user: User): Promise<Survey> {
    const { title, description, questions } = createSurveyInput;
    if (user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to create a survey.');
    };

    const survey = new Survey();
    survey.title = title;
    if (description) {
      survey.description = description;
    };
    survey.questions = [];

    const manager = this.surveyRepository.manager;
    return await manager.transaction(async (transactionalEntityManager: EntityManager) => {
      const savedSurvey = await transactionalEntityManager.save(Survey, survey);

      for (const questionInput of questions) {
        const question = new Question();
        question.text = questionInput.text;
        question.survey = savedSurvey;
        question.options = [];

        const savedQuestion = await transactionalEntityManager.save(Question, question); // 質問を保存
        savedSurvey.questions.push(savedQuestion);

        for (const optionInput of questionInput.options) {
          const option = new Option();
          option.text = optionInput.text;
          option.question = savedQuestion;

          await transactionalEntityManager.save(Option, option); // オプションを保存
          savedQuestion.options.push(option);
        }
      }
      return savedSurvey;
    });
  };

  async getResults(surveyId: number): Promise<OptionCount[]> {
    const options = await this.optionRepository.find({
      relations: ['question', 'answers'],
      where: { question: { survey: { id: surveyId } } },
    });

    return options.map((option) => ({
      optionText: option.text,
      count: option.answers.length,
    }));
  }

  async getSurveyResults(surveyId: number) {
    const answers = await this.answerRepository.find({
      where: { id: surveyId }
    });
    const result = answers.reduce((acc, answer) => {
      acc[answer.option.id] = (acc[answer.option.id] || 0) + 1;
      return acc;
    }, {});
    return result;
  }
}
