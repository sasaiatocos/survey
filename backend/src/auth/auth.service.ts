import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/auth/common/constants';
import { comparePassword } from 'src/auth/common/helper';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const lowerEmail = email.toLowerCase();
    const findUserData = await this.userRepository.findOne({
      where: {
        email: lowerEmail,
      },
      select: ['id', 'email', 'name', 'password'],
    });
    if (!findUserData) {
      throw new NotFoundException(constant.EMAIL_NOT_FOUND);
    }
    const IsValidPassword = await comparePassword(
      password,
      findUserData.password,
    );
    if (!IsValidPassword) {
      throw new BadGatewayException(constant.PROVIDED_WRONG_PASSWORD);
    }
    delete findUserData.password;
    return findUserData;
  }
}
