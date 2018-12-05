import faker from 'faker';
import uuid from 'uuid/v4';
import { toSentenceCase } from './helperFunctions';

export default {
  createSuperAdmin() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email(),
      password: 'superadmin',
      isSuperAdmin: true
    };
  },
  createAdminUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email(),
      password: 'adminpassword',
      isAdmin: true
    };
  },
  createRegularUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email(),
      password: 'regularpassword'
    };
  },

  userWithInvalidEmail() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.lorem.word(),
      password: 'Re7unthis'
    };
  },

  userWithInvalidPassword() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email(),
      password: faker.address.latitude()
    };
  },

  withNoUsername() {
    return {
      email: faker.internet.email(),
      password: 'validPa55word'
    };
  },

  withNoEmail() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      password: 'No3ma1lprov1ded'
    };
  },

  emptyFieldsUser() {
    return {
      username: '',
      email: '',
      password: 'amalfitano'
    };
  },

  createProperHabit() {
    const name = toSentenceCase('Travel more');
    return { name };
  },

  createNewHabit() {
    const name = toSentenceCase('Build an app a day');
    return { name };
  },

  createHabit() {
    const name = toSentenceCase('Run 365 miles every week');
    return { name };
  },

  user404UUID() {
    return uuid();
  },

  habit404UUID() {
    return uuid();
  },

  milestone404UUID() {
    return uuid();
  }
};
