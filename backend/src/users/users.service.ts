import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async getOneById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
