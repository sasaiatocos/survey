import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType()
export class AuthResponse {
  @Field()
  @Column()
  accessToken: string;
}
