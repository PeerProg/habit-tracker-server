import express from 'express';
import userController from '../controllers';
import authenticate, { validations } from '../middlewares';

const router = express.Router();

const {
  getAllUsers,
  getOneUser,
  updateUserDetails,
  deleteUser,
  createUser,
  login
} = userController;

const { verifyUser } = authenticate;

const {
  checkRequiredUserFields,
  checkEmptyUserFields,
  checkIfUserExists,
  validatePassword,
  validateEmail,
} = validations;

router.route('/register')
  .post(
    checkRequiredUserFields,
    checkEmptyUserFields,
    validateEmail,
    checkIfUserExists,
    validatePassword,
    createUser
  );

router.route('/login')
  .post(login);

router.route('/all')
  .get(verifyUser, getAllUsers);

router.route('/:id')
  .all(verifyUser)
  .get(getOneUser)
  .put(checkIfUserExists, updateUserDetails)
  .delete(deleteUser);

export default router;
