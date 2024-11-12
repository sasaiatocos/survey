import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OptionCount } from './option-count.output';

@ObjectType()
export class QuestionResult {
  @Field()
  questionText: string;

  @Field(() => [OptionCount])
  options: OptionCount[];
}

@ObjectType()
export class SurveyResult {
  @Field()
  surveyTitle: string;

  @Field(() => [QuestionResult])
  questions: QuestionResult[];
}