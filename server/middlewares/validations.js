import Joi from 'joi';

export default {
  register(req, res, next) {
    const schema = {
      email: Joi.string().email(),
      username: Joi.string(),
      password: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{8,32}$'))
    };

    const { error } = Joi.validate(req.body, schema);

    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).json({
            error: 'You must provide a valid email address'
          });
          break;
        case 'username':
          res.status(400).json({
            error: 'You must provide a valid username'
          });
          break;
        case 'password':
          res.status(400).json({
            error: `The password failed to match the following rules
              <br>
              1. It must contain ONLY lower case, upper case or numerics
              <br>
              2. It must be at least 8 characters long, and not more than 32 characters
            `
          });
          break;
        default:
          res.json({ error: 'Invalid registration information' });
      }
    } else {
      next();
    }
  }
};
