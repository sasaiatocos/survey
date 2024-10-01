import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Answer } from './entities/answer.entity';
import { AnswerService } from './answers.service';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Query(() => [Answer])
  questions(): Promise<Answer[]> {
    return this.answerService.getAll();
  }

  @Mutation(() => Answer)
  async createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ): Promise<Answer> {
    return await this.answerService.create(createAnswerInput);
  }
}
