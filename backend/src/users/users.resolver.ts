import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { CreateUserInput, UpdateUserInput } from 'src/users/dto/user.dto';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Query(() => User)
  async findUser(@Args({ name: 'id', type: () => Int }) id: number) {
    const user = await this.userService.getOne(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.userService.update(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.userService.delete(id);
  }
}
