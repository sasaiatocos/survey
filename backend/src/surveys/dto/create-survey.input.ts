import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOptionInput {
  @Field()
  text: string;
}

@InputType()
export class CreateQuestionInput {
  @Field()
  text: string;

  @Field(() => [CreateOptionInput])
  options: CreateOptionInput[];
}

@InputType()
export class CreateSurveyInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [CreateQuestionInput])
  questions: CreateQuestionInput[];
}