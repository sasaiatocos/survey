import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserInput } from './dto/user.dto';
import { constant } from 'src/auth/common/constants';
import { hashPassword } from 'src/auth/common/helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(createUser: CreateUserInput): Promise<UserEntity> {
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
}
