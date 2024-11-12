import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async create(input: CreateSurveyInput, user: User): Promise<Survey> {
    if (user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to create a survey.');
    }

    const survey = this.surveyRepository.create({
      title: input.title,
      description: input.description,
      user,
    });

    const savedSurvey = await this.surveyRepository.save(survey);

    for (const questionInput of input.questions) {
      const question = this.questionRepository.create({
        questionText: questionInput.questionText,
        survey: savedSurvey,
      });

      const savedQuestion = await this.questionRepository.save(question);

      for (const optionInput of questionInput.options) {
        const option = this.optionRepository.create({
          optionText: optionInput.optionText,
          question: savedQuestion,
        });
        await this.optionRepository.save(option);
      }
    }

    return savedSurvey;
  }

  async getResults(surveyId: number): Promise<OptionCount[]> {
    const options = await this.optionRepository.find({
      relations: ['question', 'answers'],
      where: { question: { survey: { id: surveyId } } },
    });

    return options.map((option) => ({
      optionText: option.optionText,
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
