import models from '../models';
import { isEmpty, uuidTester, usernameTester, emailTester } from '../helpers';

const { Users } = models;

const bodyParams = ['username', 'email', 'password'];

export default {
  checkRequiredUserFields(req, res, next) {
    const requiredPayloadParams = [];

    bodyParams.forEach(param => {
      if (!Object.keys(req.body).includes(param)) {
        requiredPayloadParams.push(`${param} is required`);
      }
    });

    if (requiredPayloadParams.length) {
      const error = new Error(JSON.stringify(requiredPayloadParams));
      error.status = 400;
      next(error);
    }

    next();
  },

  checkEmptyUserFields(req, res, next) {
    const emptyPayloadParams = [];

    bodyParams.forEach(param => {
      if (isEmpty(req.body[param])) {
        emptyPayloadParams.push(`${param} cannot be empty`);
      }
    });

    if (emptyPayloadParams.length) {
      const error = new Error(JSON.stringify(emptyPayloadParams));
      error.status = 400;
      next(error);
    }

    next();
  },

  async checkIfIdentifierIsInUse(req, res, next) {
    const { username, email } = req.body;
    const userByUsername = await Users.findOne({ where: { username } });
    const userByEmail = await Users.findOne({ where: { email } });
    if (userByUsername && req.params.id !== userByUsername.id) {
      const error = new Error('Username already in use');
      error.status = 409;
      next(error);
    } else if (userByEmail && req.params.id !== userByEmail.id) {
      const error = new Error('Email already in use');
      error.status = 409;
      next(error);
    }
    next();
  },

  validatePassword(req, res, next) {
    const validPasswordRegex = /^[a-zA-Z0-9]{8,32}$/;

    const message = `The password failed to match the following rules
      <br>
      1. It must contain ONLY lower case, upper case or numerics
      <br>
      2. It must be at least 8 characters long, and not more than 32 characters
    `;

    if (!validPasswordRegex.test(req.body.password)) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }

    next();
  },

  validateEmail(req, res, next) {
    let { email } = req.body;
    email = email.trim();

    const message = 'The email address provided is invalid';

    if (!emailTester.test(email)) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }

    next();
  },

  validateUsername(req, res, next) {
    let { username } = req.body;
    username = username.trim();
    let message;
    if (username.length < 2) {
      message = 'Username must be at least two characters';
      const error = new Error(message);
      error.status = 400;
      return next(error);
    } else if (username.length === 2 && !/^[A-Z]{2}$/i.test(username)) {
      message = 'A two-character username must have only letters';
      const error = new Error(message);
      error.status = 400;
      return next(error);
    } else if (!usernameTester(username)) {
      message =
        'Username is invalid. A username can only have numbers at the end, and can have only _ as the allowed special character only after the first two letters';
      const error = new Error(message);
      error.status = 400;
      return next(error);
    }
    next();
  },

  async checkIfUserExists(req, res, next) {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      const error = new Error(`No user with id ${req.params.id}`);
      error.status = 404;
      next(error);
    }
    next();
  },

  ensureUserParamIsValid(req, res, next) {
    if (uuidTester(req.params.id)) return next();
    const error = new Error('Invalid uuid user id param');
    error.status = 400;
    next(error);
  }
};
