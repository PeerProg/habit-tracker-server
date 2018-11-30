import models from '../models';

const { Users } = models;

export default {
  authorizeAdmin(req, res, next) {
    const isAdminOrSuper = req.decoded.isAdmin || req.decoded.isSuperAdmin;
    if (!isAdminOrSuper) {
      const error = new Error('Unauthorized');
      error.status = 403;
      next(error);
    }
    next();
  },

  authorizeAccountOwner(req, res, next) {
    if ((req.decoded.id).toString() !== (req.params.id).toString()) {
      const error = new Error('Operation not permitted on another user\'s account');
      error.status = 403;
      next(error);
    }
    next();
  },

  async userIsActive(req, res, next) {
    const userFromPK = await Users.findByPk(req.params.id);

    if (!userFromPK.isActive) {
      const error = new Error('Currently inactive. Activate to perform operation');
      error.status = 403;
      next(error);
    }

    return next();
  },

  async authorizeHabitOwnerOrAdmin(req, res, next) {
    const { params: { userId }, decoded: { id, isAdmin, isSuperAdmin } } = req;

    const isHabitsOwner = userId.toString() === id.toString();
    const isAuthorized = isAdmin || isSuperAdmin;
    if (isHabitsOwner || isAuthorized) return next();
    return res.status(401).json({ message: 'Not authorized' });
  },

  async authorizeHabitOwner(req, res, next) {
    const { params: { userId }, decoded: { id } } = req;

    const isHabitsOwner = userId.toString() === id.toString();
    if (isHabitsOwner) return next();
    return res.status(401).json({ message: 'Not authorized' });
  }
};
