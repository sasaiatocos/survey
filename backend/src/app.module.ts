import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SurveyModule } from './surveys/surveys.module';
import { QuestionModule } from './questions/questions.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { UserResolver } from './users/users.resolver';
import { AuthResolver } from './auth/auth.resolver';
import { User } from './users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { GraphqlController } from './graphql/graphql.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      installSubscriptionHandlers: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DB'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations/',
        },
      }),
      inject: [ConfigService],
    }),
    SurveyModule,
    QuestionModule,
    TypeOrmModule.forFeature([User]),
    JwtModule,
  ],
  providers: [UsersService, UserResolver, AuthService, AuthResolver],
  controllers: [GraphqlController],
})
export class AppModule {}
