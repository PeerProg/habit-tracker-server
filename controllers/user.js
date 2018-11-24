import { Op } from 'sequelize';
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
    const user = await Users.create({ username, email, password });
    const token = jwtSignUser({
      username: user.username,
      id: user.id,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    });

    const normalizedUser = {
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    };
    const responseObject = { ...normalizedUser, token };
    return res.status(201).send(responseObject);
  },

  async getOneUser(req, res) {
    const user = await Users.findByPk(req.params.id);
    const normalizedUser = {
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive
    };
    return res.send(normalizedUser);
  },

  async getAllUsers(req, res) {
    const users = await Users.findAll()
      .map((user) => {
        return {
          username: user.username,
          email: user.email,
          isActive: user.isActive
        };
      });
    return res.send(users);
  },

  async updateUserDetails(req, res) {
    const user = await Users.findByPk(req.params.id);
    const updatedUser = await user.update(req.body);
    const normalizedUser = {
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      isActive: updatedUser.isActive
    };
    const message = 'Update successful';

    const responseObject = { ...normalizedUser, message };
    return res.send(responseObject);
  },

  async deleteUser(req, res) {
    const user = await Users.findByPk(req.params.id);
    if (user.isSuperAdmin || user.isAdmin) {
      await Users.destroy({ where: { id: req.params.id } });
      return res.status(200).json({ message: 'User Removed' });
    }
    return res.status(403).json({ message: 'Admin cannot be deleted' });
  },

  async login(req, res) {
    const { identifier, password } = req.body;
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
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    };

    const message = 'Login Successful! Token expires in one week.';
    const token = jwtSignUser({
      username: user.username,
      id: user.id,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    });

    const responseObject = { ...normalizedUser, token, message };
    return res.send(responseObject);
  },

  async deactivateUserAccount(req, res, next) {
    const { id } = req.params;
    const user = await Users.findByPk({ where: { id } });
    await user.update({ isActive: false });
    res.send({ message: 'Account deactivated' });
    return next();
  },

  async activateUserAccount(req, res) {
    if (!req.decoded) {
      return res.redirect('/login');
    }
    const { body: { isActive }, decoded: { id } } = req;
    const user = await Users.findByPk({ where: { id } });
    const reactivatedUser = await user.update({ isActive });
    if (reactivatedUser.isActive) {
      res.send({ message: 'Account reactivated' });
    }
    // Activated or not, redirect to '/login'
    return res.redirect('/login');
  },

  logout(req, res) {
    if (req.decoded) delete req.decoded;
    return res.redirect('/');
  },
};
