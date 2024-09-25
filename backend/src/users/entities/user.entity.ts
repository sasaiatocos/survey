import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { MaxLength, IsEmail, IsNumber } from 'class-validator';
import { Survey } from '../../surveys/entities/survey.entity';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  GENERAL = 'general',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity('users')
@ObjectType()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  @IsNumber()
  id: number;

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
  password: string;

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

  @Field(() => [Survey])
  @OneToMany(() => Survey, (survey) => survey.user)
  readonly surveys?: Survey[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
