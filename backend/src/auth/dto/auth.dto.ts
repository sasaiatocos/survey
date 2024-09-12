import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class AuthInput {
  @Field()
  @Column()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field()
  @Column()
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
