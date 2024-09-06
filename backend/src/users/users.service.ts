import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput, UpdateUserInput } from 'src/users/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(data: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = this.getOne(id);
    if (user) {
      await this.userRepository.save(updateUserInput);
    }
  }

  async delete(id: number) {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
