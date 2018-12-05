import faker from 'faker';
import uuid from 'uuid/v4';
import { toSentenceCase } from './helperFunctions';

export default {
  createSuperAdmin() {
    return {
      username: 'superAduser54',
      email: faker.internet.email(),
      password: 'superadmin',
      isSuperAdmin: true
    };
  },
  createAdminUser() {
    return {
      username: 'adminGuy12',
      email: faker.internet.email(),
      password: 'adminpassword',
      isAdmin: true
    };
  },
  createRegularUser() {
    return {
      username: 'regularName',
      email: faker.internet.email(),
      password: 'regularpassword'
    };
  },
  createRandomUser() {
    return {
      username: 'randomName',
      email: faker.internet.email(),
      password: 'randompassword'
    };
  },
  createNormalUser() {
    return {
      username: 'normalName',
      email: faker.internet.email(),
      password: 'normalpassword'
    };
  },

  userWithInvalidEmail() {
    return {
      username: 'invalidEmailUser',
      email: faker.lorem.word(),
      password: 'Re7unthis'
    };
  },

  userWithInvalidPassword() {
    return {
      username: 'invalid123',
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
    return {
      username: 'noEmailuser_5',
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
