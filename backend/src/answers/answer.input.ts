import { InputType, Field, ID } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class AnswerInput {
  @Field(() => ID)
  @IsInt()
  surveyId: number;

  @Field(() => ID)
  @IsInt()
  questionId: number;

  @Field(() => ID)
  @IsInt()
  selectedOptionId: number;

  @Field(() => ID)
  @IsInt()
  userId: number;
}
