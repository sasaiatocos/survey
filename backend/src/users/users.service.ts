import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUser } from 'src/users/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUser: CreateUser): Promise<User> {
    const { id, name, email, provider } = createUser;
    const lowerEmail = email.toLowerCase();
    const findOneData = await this.userRepository.findOne({
      where: { email: lowerEmail },
      select: ['email'],
    });
    if (findOneData && findOneData.email) {
      throw new BadRequestException();
    }
    const data: CreateUser = {
      id,
      name,
      email: lowerEmail,
      provider,
    };
    const createUserQuery = this.userRepository.create(data);
    const saveUserData = await this.userRepository.save(createUserQuery);
    return saveUserData;
  }
}
