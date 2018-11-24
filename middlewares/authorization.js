import { Op } from 'sequelize';
import models from '../models';

const { Users } = models;

export default {
  authorizeAdmin(req, res, next) {
    const isAdminOrSuper = req.decoded.isAdmin || req.decoded.isSuperAdmin;
    if (!isAdminOrSuper) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  },

  authorizeSuperAdmin(req, res, next) {
    if (!req.decoded.isSuperAdmin) {
      return res.status(403).json({ message: 'Only a superAdmin can perfom this operation' });
    }
    next();
  },

  authorizeAccountOwner(req, res, next) {
    if (req.decoded.id !== Number(req.params.id)) {
      return res.status(401).send({ message: 'Operation not permitted another user\'s account' });
    }
    next();
  },

  async userIsActive(req, res, next) {
    // TODO: Update message to direct user to activate account
    const { body: { identifier }, params: { id } } = req;
    const userFromIdentifier = await Users.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { email: identifier },
        ],
        isActive: true
      },
    });

    const userFromPK = await Users.findOne({
      where: {
        id,
        isActive: true
      }
    });

    if (userFromIdentifier || userFromPK) {
      return next();
    }
    return res.status(403).send({ message: 'Currently inactive' });
  }
};
