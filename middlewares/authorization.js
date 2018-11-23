export default {
  authorizeAdmin(req, res, next) {
    if (req.decoded.id !== 1) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  },

  authorizeAccountOwner(req, res, next) {
    if (req.decoded.id !== Number(req.params.id)) {
      return res.status(401).send({ message: 'Operation not permitted another user\'s account' });
    }
    next();
  }
};
