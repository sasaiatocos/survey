import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from 'src/users/entities/user.entity';

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.name = faker.internet.userName();
  user.email = faker.internet.email();
  return user;
});
