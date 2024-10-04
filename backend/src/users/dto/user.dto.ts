import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
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
  password: string;
}
