import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';

@ObjectType()
export class AuthResponse {
  @Field()
  @Column()
  accessToken: string;

  @Field()
  @Column()
  refreshToken: string;

  @Field(() => User)
  @Column()
  user: User;
}
