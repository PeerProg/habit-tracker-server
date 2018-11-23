import express from 'express';
import userController from '../controllers';
import authenticate, { validations } from '../middlewares';

const router = express.Router();

const {
  fetchAllUsers,
  fetchUser,
  updateUserDetails,
  deleteUser,
  createUser,
  login
} = userController;

const { verifyUser } = authenticate;

router.route('/register')
  .post(validations.register, createUser);

router.route('/login')
  .post(login);

router.route('/all')
  .get(verifyUser, fetchAllUsers);

router.route('/:id')
  .all(verifyUser)
  .get(fetchUser)
  .put(updateUserDetails)
  .delete(deleteUser);

export default router;
