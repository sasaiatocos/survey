import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateSurvey {
  @Field()
  @Column()
  @IsNotEmpty()
  title: string;

  @Field()
  @Column()
  @IsNotEmpty()
  expiredAt: string;
}
