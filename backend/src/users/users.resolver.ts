import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput, UpdateUserInput } from 'src/users/dto/user.dto';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    console.log('TEST');
    return this.usersService.getAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async findUser(@Args({ name: 'email', type: () => String }) email: string) {
    const user = await this.usersService.getOne(email);
    if (!user) {
      throw new NotFoundException(email);
    }
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.usersService.update(email, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.usersService.delete(id);
  }
}
