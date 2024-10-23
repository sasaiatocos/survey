import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/auth/strategies/jwt-refresh.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { User } from 'src/users/entities/user.entity';
import { UserResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UsersService, JwtStrategy, JwtRefreshStrategy],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
