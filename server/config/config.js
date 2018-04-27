require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    operatorsAliases: false
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    operatorsAliases: false
  },
  travis: {
    use_env_variable: process.env.TRAVIS_DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    dialect: 'postgres',
    operatorsAliases: false
  }
};

