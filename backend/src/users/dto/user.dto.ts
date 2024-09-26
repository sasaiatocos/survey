import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
class getAttributesAllUser {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;
}

@ObjectType()
export class CheckConnectionDTO {
  @Field()
  connectionStatus: string;
}

@ObjectType()
export class AllUserResponseDTO {
  @Field(() => getAttributesAllUser)
  user: getAttributesAllUser;

  @Field(() => [getAttributesAllUser])
  AllUserData: getAttributesAllUser[];
}
