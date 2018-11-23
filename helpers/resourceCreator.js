import faker from 'faker';

export default {
  createNewUser() {
    return {
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: 'foLLowTherules'
    };
  },

  userWithInvalidEmail() {
    return {
      username: faker.name.firstName(),
      email: faker.lorem.word(),
      password: 'Re7unthis'
    };
  },

  userWithInvalidPassword() {
    return {
      username: faker.name.lastName(),
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
    return {
      username: faker.name.firstName(),
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
