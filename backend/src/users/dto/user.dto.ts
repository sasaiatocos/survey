import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateUserInput {
  @Field()
  @Column()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @Column()
  email: string;

  @Field()
  @Column()
  @MinLength(8)
  password: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  @IsEmail()
  email: string;

  @Field()
  @Column()
  @MinLength(8)
  password: string;
}
