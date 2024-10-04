import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Selection } from 'src/selections/entities/selection.entity';
import { Args } from '@nestjs/graphql';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  getAll(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  async create(
    @Args('userId') userId: number,
    @Args('selectionId') selectionId: number,
    @Args('questionId') questionId: number,
  ): Promise<Answer> {
    const user = new UserEntity();
    const selection = new Selection();
    const question = new Question();
    const setAnswer = new Answer();
    user.id = userId;
    selection.id = selectionId;
    question.id = questionId;
    return this.answerRepository.save(setAnswer);
  }
}
