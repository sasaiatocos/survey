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
    @Args('title') title: string,
    @Args('surveyId') surveyId: number,
  ): Promise<Question> {
    const question = new Question();
    const survey = await this.surveyService.getOne(surveyId);
    question.survey = survey;
    question.title = title;
    return this.questionRepository.save(question);
  }
}
