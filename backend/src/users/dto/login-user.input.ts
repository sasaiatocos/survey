import { InputType, Field } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class LoginUserInput {
  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}