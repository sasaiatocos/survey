import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OptionCount {
  @Field()
  optionText: string;

  @Field(() => Int)
  count: number;
}