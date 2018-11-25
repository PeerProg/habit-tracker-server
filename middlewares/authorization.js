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
  }
};
