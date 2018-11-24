import express from 'express';
import userController from '../controllers';
import authenticate, { validations, authorization } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authenticate;
const { authorizeAdmin, authorizeAccountOwner, userIsActive } = authorization;

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
  deactivateUserAccount,
  activateUserAccount,
  login,
  logout,
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

router.route('/logout')
  .delete(logout);

router.route('/all')
  .get(authenticateUser, getAllUsers);

router.route('/deactivate/:id')
  .put(
    authenticateUser,
    ensureParamIsInteger,
    checkIfUserExists,
    authorizeAccountOwner,
    deactivateUserAccount,
    logout
  );

// Ideally, this route will only be available if a deactivated user tries to login.
router.route('/activate/:id')
  .put(ensureParamIsInteger, checkIfUserExists, activateUserAccount);

router.route('/:id')
  .put(
    userIsActive,
    authenticateUser,
    authorizeAccountOwner,
    checkIfIdentifierIsInUse,
    updateUserDetails
  )
  .all(authenticateUser, ensureParamIsInteger, checkIfUserExists)
  .get(getOneUser)
  .delete(authorizeAdmin, deleteUser);

export default router;
