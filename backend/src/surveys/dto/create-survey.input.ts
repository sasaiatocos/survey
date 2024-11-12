import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOptionInput {
  @Field()
  optionText: string;
}

@InputType()
export class CreateQuestionInput {
  @Field()
  questionText: string;

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