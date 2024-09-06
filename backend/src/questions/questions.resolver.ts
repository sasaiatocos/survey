import { NotFoundException } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateQuestionInput,
  UpdateQuestionInput,
} from 'src/questions/dto/question.dto';
import { Question } from 'src/questions/entities/question.entity';
import { QuestionService } from 'src/questions/questions.service';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Query(() => [Question])
  questions(): Promise<Question[]> {
    return this.questionService.getAll();
  }

  @Query(() => Question)
  async findQuestion(@Args({ name: 'id', type: () => Int }) id: number) {
    const question = await this.questionService.getOne(id);
    if (!question) {
      throw new NotFoundException(id);
    }
    return question;
  }

  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    return await this.questionService.create(createQuestionInput);
  }

  @Mutation(() => Question)
  async updateQuestion(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return await this.questionService.update(id, updateQuestionInput);
  }

  @Mutation(() => Boolean)
  async deleteQuestion(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.questionService.delete(id);
  }
}
