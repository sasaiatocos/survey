import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field(() => Int)
  questionId: number;

  @Field(() => Int)
  optionId: number;
}