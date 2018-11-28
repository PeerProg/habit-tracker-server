import express from 'express';
import userController from '../controllers';
import { validations, authorization, authentication } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const { authorizeAdmin, authorizeAccountOwner, userIsActive } = authorization;

const {
  checkRequiredUserFields,
  checkEmptyUserFields,
  checkIfUserExists,
  checkIfIdentifierIsInUse,
  validatePassword,
  ensureParamIsInteger,
  validateEmail,
  normalizeUsernameField
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
    normalizeUsernameField,
    createUser
  );

router.route('/login')
  .post(normalizeUsernameField, login);

router.route('/logout')
  .delete(logout);

router.route('/all')
  .get(authenticateUser, getAllUsers);

router.route('/deactivate/:id')
  .put(
    ensureParamIsInteger,
    authenticateUser,
    checkIfUserExists,
    authorizeAccountOwner,
    deactivateUserAccount,
  );

// Ideally, this route will only be available if a deactivated user tries to login.
router.route('/activate/:id')
  .put(ensureParamIsInteger, checkIfUserExists, activateUserAccount);

router.route('/:id')
  .all(ensureParamIsInteger, checkIfUserExists)
  .put(
    userIsActive,
    authenticateUser,
    authorizeAccountOwner,
    checkIfIdentifierIsInUse,
    normalizeUsernameField,
    updateUserDetails
  )
  .get(authenticateUser, getOneUser)
  .delete(authenticateUser, authorizeAdmin, deleteUser);

export default router;
