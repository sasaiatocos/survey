import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateSurveyInput {
  @Field()
  @Column()
  @IsNumber()
  adminId: number;

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
export class UpdateSurveyInput extends PartialType(CreateSurveyInput) {
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
