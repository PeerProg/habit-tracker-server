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

  authorizeAccountOwner(req, res, next) {
    if (req.decoded.id !== Number(req.params.id)) {
      return res.status(401).send({ message: 'Operation not permitted on another user\'s account' });
    }
    next();
  },

  async userIsActive(req, res, next) {
    const userFromPK = await Users.findByPk(req.params.id);

    if (!userFromPK.isActive) {
      return res.status(403).send({ message: 'Currently inactive. Activate to perform operation' });
    }

    return next();
  },

  async authorizeHabitOwnerOrAdmin(req, res, next) {
    const { params: { userId }, decoded: { id, isAdmin, isSuperAdmin } } = req;

    const isHabitsOwner = Number(userId) === id;
    const isAuthorized = isAdmin || isSuperAdmin;
    if (isHabitsOwner || isAuthorized) return next();
    return res.status(401).json({ message: 'Not authorized' });
  },

  async authorizeHabitOwner(req, res, next) {
    const { params: { userId }, decoded: { id } } = req;

    const isHabitsOwner = Number(userId) === id;
    if (isHabitsOwner) return next();
    return res.status(401).json({ message: 'Not authorized' });
  }
};
