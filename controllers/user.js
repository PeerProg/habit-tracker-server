import Sequelize, { Op } from 'sequelize';
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
      const user = await Users.create({ username, email, password });
      const token = jwtSignUser({ username: user.username, id: user.id });
      const normalizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      const responseObject = { ...normalizedUser, token };

      return res.status(201).send(responseObject);
    } catch (err) {
      return res.json({ error: err.message });
    }
  },

  async getOneUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID should be a number' });
      }
      const user = await Users.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: `No user with id ${req.params.id}` });
      }
      return res.send({ username: user.username, email: user.email });
    } catch (err) {
      return res.status(500).json({ error: 'An error occured' });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await Users.findAll()
        .map((user) => {
          return {
            username: user.username,
            email: user.email
          };
        });
      if (users.length) {
        return res.send(users);
      }
      return res.status(404).json({ message: 'No users created yet' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async updateUserDetails(req, res) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid param. ID should be a number' });
      }
      const user = await Users.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: `No user with id ${req.params.id}` });
      }
      if (id === req.decoded.id) {
        const updatedUser = await user.update(req.body);
        const normalizedUser = {
          username: updatedUser.username,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        };
        const message = 'Update successful';

        const responseObject = { ...normalizedUser, message };
        return res.send(responseObject);
      }
      return res.status(401).send({ message: 'You cannot update another user\'s details' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid param. ID should be a number' });
      }
      const user = await Users.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: `No user with id ${req.params.id}` });
      }
      if (req.decoded.id === 1) {
        if (user.id !== 1) {
          const deletedUser = await Users.destroy({ where: { id } });
          if (deletedUser === 1) {
            return res.status(200).json({ message: 'User Removed' });
          }
        }
        return res.status(403).json({ message: 'Admin cannot be deleted' });
      }
      return res.status(403).json({ message: 'Unauthorized' });
    } catch (err) {
      return res.status(500).json({ error: 'An error occured' });
    }
  },

  async login(req, res) {
    const { identifier, password } = req.body;
    try {
      const user = await Users.findOne({
        where: {
          [Op.or]: [
            { username: identifier },
            { email: identifier },
          ],
        },
      });
      if (!user) {
        return res.status(403).json({ message: 'Incorrect Login Information' });
      }
      if (!user.validPassword(password)) {
        return res.status(403).json({ message: 'Invalid credentials' });
      }

      const normalizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      const message = 'Login Successful! Token expires in one week.';
      const token = jwtSignUser({ username: user.username, id: user.id });

      const responseObject = { ...normalizedUser, token, message };
      return res.send(responseObject);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
