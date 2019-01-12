import faker from 'faker';
import uuid from 'uuid/v4';
import { toSentenceCase } from './helperFunctions';

export default {
  createSuperAdmin() {
    return {
      username: 'superAduser54',
      email: faker.internet.email(),
      password: 'superadmin',
      isSuperAdmin: true,
      imageURL: 'http://imageURL/goes/here.png'
    };
  },
  createAdminUser() {
    return {
      username: 'adminGuy12',
      email: faker.internet.email(),
      password: 'adminpassword',
      isAdmin: true,
      imageURL: 'http://imageURL/goes/here.png'
    };
  },
  createRegularUser() {
    return {
      username: 'regularName',
      email: faker.internet.email(),
      password: 'regularpassword',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },
  createRandomUser() {
    return {
      username: 'randomName',
      email: faker.internet.email(),
      password: 'randompassword',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },
  createNormalUser() {
    return {
      username: 'normalName',
      email: faker.internet.email(),
      password: 'normalpassword',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  userWithInvalidEmail() {
    return {
      username: 'invalidEmailUser',
      email: faker.lorem.word(),
      password: 'Re7unthis',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  userWithInvalidUsername() {
    return {
      username: '123saturday',
      email: faker.internet.email(),
      password: 'Re7unthis',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  userWithOnlyNumsForUsername() {
    return {
      username: '43',
      email: faker.internet.email(),
      password: 'Re7unthis',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  userWithOneCharUsername() {
    return {
      username: 'm',
      email: faker.internet.email(),
      password: 'Re7unthis',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  userWithInvalidPassword() {
    return {
      username: 'invalid123',
      email: faker.internet.email(),
      password: faker.address.latitude(),
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  userWithInvalidImageURL() {
    return {
      username: 'invalidImageURL',
      email: faker.internet.email(),
      password: 'normalpassword',
      imageURL: 'http://imageURL/goes/here'
    };
  },

  userWithNoImageURL() {
    return {
      username: 'noImageURL',
      email: faker.internet.email(),
      password: 'normalpassword'
    };
  },

  withNoUsername() {
    return {
      email: faker.internet.email(),
      password: 'validPa55word',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  withNoEmail() {
    return {
      username: 'noEmailuser_5',
      password: 'No3ma1lprov1ded',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  emptyFieldsUser() {
    return {
      username: '',
      email: '',
      password: 'amalfitano',
      imageURL: 'http://imageURL/goes/here.png'
    };
  },

  createProperHabit() {
    const name = toSentenceCase('Travel more');
    const startAt = 'January 12th 2019, 12:00:59 pm';
    const expiresAt = 'Sunday at 11:03 AM';
    return {
      name,
      expiresAt,
      startAt
    };
  },

  createNewHabit() {
    const name = toSentenceCase('Build an app a day');
    const startAt = 'January 12th 2019, 12:00:59 pm';
    const expiresAt = 'Sunday at 11:03 AM';
    return {
      name,
      expiresAt,
      startAt
    };
  },

  createHabit() {
    const name = toSentenceCase('Run 365 miles every week');
    const startAt = 'January 12th 2019, 12:00:59 pm';
    const expiresAt = 'Sunday at 11:03 AM';
    return {
      name,
      expiresAt,
      startAt
    };
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
