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

    for (const questionInput of questions) {
      const question = new Question();
      question.text = questionInput.text;
      question.survey = survey;
      question.options = [];

      for (const optionInput of questionInput.options) {
        const option = new Option();
        option.text = optionInput.text;
        option.question = question;
        await this.optionRepository.save(option);
        question.options.push(option);
      }
      await this.questionRepository.save(question);
      survey.questions.push(question);
    }
    return this.surveyRepository.save(survey);
  }

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
