import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './guards/session/serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { LocalStrategy } from './strategies/passport-strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule],
  providers: [AuthService, AuthResolver, LocalStrategy, SessionSerializer],
  exports: [LocalStrategy],
})
export class AuthModule {}
