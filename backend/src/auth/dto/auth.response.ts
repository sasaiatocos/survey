import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';

@ObjectType()
export class AuthResponse {
  @Field()
  @Column()
  LoginSuccessMessage: string;

  @Field(() => User)
  @Column()
  user: User;
}
