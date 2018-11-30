import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import models from '../models';

const { Users } = models;

const secretOrPrivateKey = process.env.SECRET;

export default {
  authenticateUser(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      const error = new Error('No token provided');
      error.status = 400;
      next(error);
    }
    jwt.verify(token, secretOrPrivateKey, (error, decoded) => {
      if (error) {
        const err = new Error('Invalid token');
        err.status = 401;
        next(err);
      }
      req.decoded = decoded;
      next();
    });
  },

  async verifyLoginDetails(req, res, next) {
    const { identifier, password } = req.body;
    const user = await Users.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }]
      }
    });

    if (!user) {
      const error = new Error('Incorrect Login Information');
      error.status = 401;
      return next(error);
    }
    if (!user.validPassword(password)) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      return next(error);
    }
    if (!user.isActive) {
      return res.redirect(`/activate/${user.id}`);
    }

    next();
  }
};
