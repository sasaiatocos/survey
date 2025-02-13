import { InputType, Field } from '@nestjs/graphql';
import { QuestionType } from '../entities/question.entity';
import { IsEnum, IsOptional } from 'class-validator';

@InputType()
export class CreateOptionInput {
  @Field()
  text: string;
}

@InputType()
export class CreateQuestionInput {
  @Field()
  text: string;

  @Field(() => QuestionType)
  @IsEnum(QuestionType)
  type: QuestionType;

  @Field(() => [CreateOptionInput], { nullable: true })
  @IsOptional()
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