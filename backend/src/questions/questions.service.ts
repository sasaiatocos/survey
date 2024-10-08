import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
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
    question.surveyId = surveyId;
    question.title = title;
    return this.questionRepository.save(question);
  }
}
