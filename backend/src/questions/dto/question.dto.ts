import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateQuestionInput {
  @Field()
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;
}
