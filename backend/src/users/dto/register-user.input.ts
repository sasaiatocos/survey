import { InputType, Field } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class RegisterUserInput {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}
