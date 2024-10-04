import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from 'src/users/entities/user.entity';

export const UsersFactory = setSeederFactory(UserEntity, (faker: Faker) => {
  const user = new UserEntity();
  user.name = faker.internet.userName();
  user.email = faker.internet.email();
  return user;
});
