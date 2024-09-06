import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateQuestionInput {
  @Field()
  @Column()
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @Column()
  @MaxLength(191)
  @IsString()
  description: string;
}

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @Field()
  @Column()
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @Column()
  @MaxLength(191)
  @IsString()
  description: string;
}
