import faker from 'faker';
import { toSentenceCase } from './helperFunctions';

export default {
  createSuperAdmin() {
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email().toLowerCase(),
      password: 'superadmin',
      isSuperAdmin: true
    };
  },
  createAdminUser() {
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email().toLowerCase(),
      password: 'adminpassword',
      isAdmin: true
    };
  },
  createRegularUser() {
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email().toLowerCase(),
      password: 'regularpassword'
    };
  },

  userWithInvalidEmail() {
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.lorem.word(),
      password: 'Re7unthis'
    };
  },

  userWithInvalidPassword() {
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email().toLowerCase(),
      password: faker.address.latitude(),
    };
  },

  withNoUsername() {
    return {
      email: faker.internet.email().toLowerCase(),
      password: 'validPa55word'
    };
  },

  withNoEmail() {
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
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
    const milestones = [
      'save money monthly',
      'target PTO for mid-month',
      'Research places, read travel blogs'
    ].map(item => toSentenceCase(item));

    return {
      name,
      milestones
    };
  },

  createNewHabit() {
    const name = toSentenceCase('Build an app a day');
    const milestones = [
      'Wake up early',
      'Do not overthink things',
      'Think of modest complexity'
    ].map(item => toSentenceCase(item));

    return {
      name,
      milestones
    };
  }
};
