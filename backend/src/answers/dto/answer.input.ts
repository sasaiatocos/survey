import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class AnswerInput {
  @Field(() => Int)
  @IsInt()
  surveyId: number;

  @Field(() => Int)
  @IsInt()
  questionId: number;

  @Field(() => [Int!]!, { nullable: true })
  optionIds: number[];

  @Field({ nullable: true })
  textResponse?: string;

  @Field(() => Int)
  @IsInt()
  userId: number;
}
