import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, PrimaryColumn } from 'typeorm';

@InputType()
export class CreateUser {
  @Field()
  @PrimaryColumn()
  @IsNotEmpty()
  id: string;

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
  provider: string;
}
