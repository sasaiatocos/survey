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

  @Field(() => ID, { nullable: true })
  selectedOptionIds: number[];

  @Field({ nullable: true })
  textResponse?: string;

  @Field(() => ID)
  @IsInt()
  userId: number;
}
