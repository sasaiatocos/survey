import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { SurveyService } from 'src/surveys/surveys.service';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private surveyService: SurveyService,
  ) {}

  getAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async getOne(id: number) {
    return this.questionRepository.findOne({ where: { id } });
  }

  async create(
    @Args('question') question: string,
    @Args('surveyId') surveyId: number,
  ): Promise<Question> {
    const questions = new Question();
    const survey = await this.surveyService.getOne(surveyId);
    questions.survey = survey;
    questions.question = question;
    return this.questionRepository.save(questions);
  }
}
