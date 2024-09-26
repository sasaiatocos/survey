import bcrypt from 'bcrypt';
import { constant } from './constants';

export interface IGenerateToken {
  id: number;
  name: string;
  email: string;
}

const hashPassword = (plainPassword: string) =>
  bcrypt.hash(plainPassword, constant.HASH_SALT_COUNT);

const comparePassword = (plainPassword: string, hasPassword: string) =>
  bcrypt.compare(plainPassword, hasPassword);

export { hashPassword, comparePassword };
