import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateSelectionInput {
  @Field()
  @Column()
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  option: string;
}
