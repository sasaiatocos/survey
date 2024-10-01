import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MaxLength, IsEmail, IsString } from 'class-validator';
import { Answer } from 'src/answers/entities/answer.entity';

export enum UserRole {
  ADMIN = 'admin',
  GENERAL = 'general',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity('users')
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field()
  @IsString()
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @Field()
  @MaxLength(50)
  name: string;

  @Column()
  @Field()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar' })
  @Field()
  provider: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GENERAL,
  })
  @Field(() => UserRole)
  role: UserRole;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @CreateDateColumn()
  updatedAt: Date;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.user)
  readonly answers?: Answer[];
}
