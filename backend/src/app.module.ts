import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { SurveyModule } from './surveys/surveys.module';
import { QuestionModule } from './questions/questions.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { UserResolver } from './users/users.resolver';
import { AuthResolver } from './auth/auth.resolver';
import { User } from './users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
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
})
export class AppModule {}
