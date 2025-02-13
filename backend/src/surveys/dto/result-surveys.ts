import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class OptionStats {
  @Field(() => ID)
  id: number;

  @Field()
  text: string;

  @Field()
  responseCount: number;
}

@ObjectType()
export class QuestionStats {
  @Field(() => ID)
  id: number;

  @Field()
  text: string;

  @Field(() => [OptionStats])
  options: OptionStats[];
}

@ObjectType()
export class SurveyStats {
  @Field()
  totalResponses: number;

  @Field()
  uniqueRespondents: number;

  @Field(() => [QuestionStats])
  questions: QuestionStats[];
}
