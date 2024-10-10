import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Selection } from './entities/selection.entity';
import { Repository } from 'typeorm';
import { Args } from '@nestjs/graphql';

import { QuestionService } from '../questions/questions.service';

@Injectable()
export class SelectionService {
  constructor(
    @InjectRepository(Selection)
    private selectionRepository: Repository<Selection>,
    private questionService: QuestionService,
  ) {}

  getAll(): Promise<Selection[]> {
    return this.selectionRepository.find();
  }

  async create(
    @Args('option') option: string,
    @Args('questionId') questionId: number,
  ): Promise<Selection> {
    const selection = new Selection();
    const question = await this.questionService.getOne(questionId);
    selection.question = question;
    selection.option = option;
    return this.selectionRepository.save(selection);
  }
}
