import models from '../models';
import { isEmpty } from '../helpers';

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
      return res.status(403).json({ error: requiredPayloadParams });
    }

    return next();
  },

  checkEmptyUserFields(req, res, next) {
    const emptyPayloadParams = [];

    bodyParams.forEach(param => {
      if (isEmpty(req.body[param])) {
        emptyPayloadParams.push(`${param} cannot be empty`);
      }
    });

    if (emptyPayloadParams.length) {
      return res.status(403).json({ error: emptyPayloadParams });
    }

    return next();
  },

  async checkIfUserExists(req, res, next) {
    const { username, email } = req.body;
    const usernameExists = await Users.findOne({ where: { username } });
    const emailExists = await Users.findOne({ where: { email } });
    if (usernameExists) {
      return res.status(409).json({ message: 'Username already in use' });
    } else if (emailExists) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    return next();
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
      return res.status(400).send({ message });
    }

    return next();
  },

  validateEmail(req, res, next) {
    // eslint-disable-next-line no-control-regex
    const validEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const message = 'The email address provided is invalid';

    if (!validEmailRegex.test(req.body.email)) {
      return res.status(400).send({ message });
    }

    return next();
  },
};
