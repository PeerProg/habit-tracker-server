import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import models from '../models';

const { Users } = models;

const secretOrPrivateKey = process.env.SECRET;

function jwtSignUser(payload) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(payload, secretOrPrivateKey, {
    expiresIn: ONE_WEEK
  });
}

export default {
  async createUser(req, res) {
    let { username, email } = req.body;
    username = username && username.trim().toLowerCase();
    email = email && email.trim().toLowerCase();
    const requestBody = { ...req.body, username, email }
    const user = await Users.create(requestBody);
    const token = jwtSignUser({
      username: user.username,
      id: user.id,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    });

    const normalizedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
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
      isActive: user.isActive,
      isSuperAdmin: user.isSuperAdmin,
      isAdmin: user.isAdmin
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
    let { username, email } = req.body;
    username = username && username.trim().toLowerCase();
    email = email && email.trim().toLowerCase();
    
    const user = await Users.findByPk(req.params.id);
    const updatedUser = await user.update({
      username: username || user.username,
      email: email || user.email,
    });

    const normalizedUser = {
      id: updatedUser.id,
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
      return res.status(403).json({ message: 'Admin cannot be deleted' });
    }
    await Users.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'User Removed' });
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
    if (!user.isActive) {
      return res.redirect(`/activate/${user.id}`);
    }

    const normalizedUser = {
      id: user.id,
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
    const { params: { id }, body: { isActive } } = req;
    const user = await Users.findByPk(id);
    const deactivatedUser = await user.update({ isActive });
    if (!deactivatedUser.isActive) {
      jwtSignUser({
        username: deactivatedUser.username,
        id: deactivatedUser.id,
        isActive: deactivatedUser.isActive,
        isAdmin: deactivatedUser.isAdmin,
        isSuperAdmin: deactivatedUser.isSuperAdmin
      });
      res.json({ message: 'Account deactivated', isActive: deactivatedUser.isActive });
      return next();
    }
    return res.send({ message: 'Account still active. Try again.' });
  },

  async activateUserAccount(req, res) {
    // TODO: Find a way to ensure the owner of the account is the one reactivating
    const { body: { isActive } } = req;
    const user = await Users.findByPk(req.params.id);
    const reactivatedUser = await user.update({ isActive });
    if (reactivatedUser.isActive) {
      jwtSignUser({
        username: reactivatedUser.username,
        id: reactivatedUser.id,
        isActive: reactivatedUser.isActive,
        isAdmin: reactivatedUser.isAdmin,
        isSuperAdmin: reactivatedUser.isSuperAdmin
      });
      return res.send({ message: 'Account reactivated' });
    }
    return res.send({ message: 'Account still inactive. Try again.' });
  },

  logout(req, res) {
    return res.redirect('/');
  },
};
