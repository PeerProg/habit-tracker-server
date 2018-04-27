import jwt from 'jsonwebtoken';

const secretOrPrivateKey = process.env.SECRET || 'passkey';

export default {
  verifyUser(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No token provided!' });
    }
    jwt.verify(token, secretOrPrivateKey, (error, decoded) => {
      if (error) {
        return res.status(500).json({ message: 'An error occured' });
      }
      req.decoded = decoded;
      next();
    });
  }
}
