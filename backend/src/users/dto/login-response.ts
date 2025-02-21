import { ObjectType, Field } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType()
export class LoginResponse {
  @Field()
  @Column()
  accessToken: string;
}