import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateSurveyInput {
  @Field()
  @Column()
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @Column()
  @IsDate()
  @IsNotEmpty()
  expired_at: string;
}
