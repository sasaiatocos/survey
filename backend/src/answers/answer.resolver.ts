import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';

@Resolver('Answer')
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => [Answer])
  async submitAnswer(
    @Args('userId') userId: number,
    @Args('optionIds', { type: () => [Number] }) optionIds: number[]
  ) {
    return this.answerService.submitAnswer(userId, optionIds);
  }
}
