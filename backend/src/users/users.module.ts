import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UsersService, JwtStrategy],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
