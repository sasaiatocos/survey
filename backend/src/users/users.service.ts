import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput } from './dto/user.dto';
import { constant } from 'src/auth/common/constants';
import { hashPassword } from 'src/auth/common/helper';
import { Args } from '@nestjs/graphql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async getOneById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(createUser: CreateUserInput): Promise<User> {
    const { name, email, password } = createUser;
    const lowerEmail = email.toLowerCase();
    const findOneData = await this.userRepository.findOne({
      where: { email: lowerEmail },
      select: ['email'],
    });
    if (findOneData && findOneData.email) {
      throw new BadRequestException(constant.USER_ALREADY_EXIST);
    }
    const hashPasswordValue = await hashPassword(password);
    const data: CreateUserInput = {
      name,
      email: lowerEmail,
      password: hashPasswordValue,
    };
    const createUserQuery = this.userRepository.create(data);
    const saveUserData = await this.userRepository.save(createUserQuery);
    return saveUserData;
  }

  async update(
    id: number,
    @Args('hashedRefreshToken') hashedRefreshToken: string
  ) {
    const user = this.getOneById(id);
    if (user) {
      await this.userRepository.save({
        id: (await user).id, hashedRefreshToken: hashedRefreshToken
      });
    }
  }
}
