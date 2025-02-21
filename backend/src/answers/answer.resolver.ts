import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { AnswerInput } from './dto/answer.input';

@Resolver('Answer')
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => [Answer])
  async submitAnswers(
    @Args({ name: 'answers', type: () => [AnswerInput] }) answers: AnswerInput[]
  ): Promise<Answer[]>{
    return this.answerService.submitAnswer(
      answers
    );
  }
}
