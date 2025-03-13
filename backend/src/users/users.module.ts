import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UsersService, JwtStrategy],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
