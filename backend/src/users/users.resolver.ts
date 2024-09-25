import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AllUserResponseDTO, CreateUserInput } from 'src/users/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticated } from 'src/auth/guards/check.authentication.guard';
import { User } from 'src/users/user.decoder';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserEntity)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserEntity> {
    return await this.usersService.createUser(createUserInput);
  }

  @UseGuards(IsAuthenticated)
  @Query(() => AllUserResponseDTO)
  async getAllUserData(@User() user: UserEntity): Promise<AllUserResponseDTO> {
    const userData: UserEntity[] | [] = await this.usersService.getAllUserData(
      user.id,
    );
    return { AllUserData: userData, CurrentUser: user };
  }
}
