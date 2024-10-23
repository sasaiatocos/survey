import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { MaxLength, IsEmail } from 'class-validator';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
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

  @Column({default: 0})
  @Field()
  isAdmin: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  hashedRefreshToken: string | null;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @CreateDateColumn()
  updatedAt: Date;
}
