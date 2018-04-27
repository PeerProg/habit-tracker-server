import jwt from 'jsonwebtoken';
import models from '../models';

const { Users } = models;

const secretOrPrivateKey = process.env.SECRET || 'passkey';

function jwtSignUser(payload) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(payload, secretOrPrivateKey, {
    expiresIn: ONE_WEEK
  });
}

export default {
  async createUser(req, res) {
    const { username, email, password } = req.body;
    try {
      const usernameExists = await Users.findOne({ where: { username } });
      const emailExists = await Users.findOne({ where: { email } });
      if (usernameExists) {
        return res.status(409).json({ conflict: 'Username already in use' });
      } else if (emailExists) {
        return res.status(409).json({ conflict: 'Email already in use' });
      }
      const user = await Users.create({ username, email, password });
      return res.status(201).json({
        message: 'User creation Successful!',
        token: jwtSignUser({ username: user.username }),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: 'An error occured' });
    }
  }
};
