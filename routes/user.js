import express from 'express';
import userController from '../controllers';
import authenticate, { validations, authorization } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authenticate;
const { authorizeAdmin, authorizeAccountOwner } = authorization;

const {
  checkRequiredUserFields,
  checkEmptyUserFields,
  checkIfUserExists,
  checkIfIdentifierIsInUse,
  validatePassword,
  ensureParamIsInteger,
  validateEmail,
} = validations;

const {
  getAllUsers,
  getOneUser,
  updateUserDetails,
  deleteUser,
  createUser,
  login
} = userController;

router.route('/register')
  .post(
    checkRequiredUserFields,
    checkEmptyUserFields,
    validateEmail,
    checkIfIdentifierIsInUse,
    validatePassword,
    createUser
  );

router.route('/login')
  .post(login);

router.route('/all')
  .get(authenticateUser, getAllUsers);

router.route('/:id')
  .all(authenticateUser, ensureParamIsInteger, checkIfUserExists)
  .get(getOneUser)
  .put(authorizeAccountOwner, checkIfIdentifierIsInUse, updateUserDetails)
  .delete(authorizeAdmin, deleteUser);

export default router;
