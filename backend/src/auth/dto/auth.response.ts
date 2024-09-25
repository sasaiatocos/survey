import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';

@ObjectType()
export class AuthResponse {
  @Field()
  @Column()
  LoginSuccessMessage: string;

  @Field(() => UserEntity)
  @Column()
  user: UserEntity;
}
