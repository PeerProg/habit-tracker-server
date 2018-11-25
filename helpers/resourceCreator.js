import faker from 'faker';

export default {
  createSuperAdmin() {
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
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
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
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
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
    const joinedNames = `${firstName}${lastName}`;
    const username = joinedNames.substring(2);
    return {
      username,
      email: faker.internet.email(),
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
      email: faker.internet.email(),
      password: faker.address.latitude(),
    };
  },

  withNoUsername() {
    return {
      email: faker.internet.email(),
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
  }
};
