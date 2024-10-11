import { NotFoundException } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
    @Args('question') question: string,
    @Args('surveyId') surveyId: number,
  ): Promise<Question> {
    console.log();
    return await this.questionService.create(question, surveyId);
  }
}
