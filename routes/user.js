import express from 'express';
import userController from '../controllers';
import { userValidations, authorization, authentication } from '../middlewares';

const router = express.Router();

const { authenticateUser, verifyLoginDetails } = authentication;
const { authorizeAdmin, authorizeAccountOwner, userIsActive } = authorization;

const {
  checkRequiredUserFields,
  checkEmptyUserFields,
  checkIfUserExists,
  checkIfIdentifierIsInUse,
  validatePassword,
  validateEmail,
  validateUsername,
  ensureUserParamIsValid
} = userValidations;

const {
  getAllUsers,
  getOneUser,
  updateUserDetails,
  deleteUser,
  createUser,
  deactivateUserAccount,
  activateUserAccount,
  login,
  logout
} = userController;

router
  .route('/register')
  .post(
    checkRequiredUserFields,
    checkEmptyUserFields,
    validateUsername,
    validateEmail,
    checkIfIdentifierIsInUse,
    validatePassword,
    createUser
  );

router.route('/login').post(verifyLoginDetails, login);

router.route('/logout').delete(logout);

router.route('/all').get(authenticateUser, getAllUsers);

router
  .route('/deactivate/:id')
  .patch(
    ensureUserParamIsValid,
    authenticateUser,
    checkIfUserExists,
    authorizeAccountOwner,
    deactivateUserAccount
  );

// Ideally, this route will only be available if a deactivated user tries to login.
router
  .route('/activate/:id')
  .patch(ensureUserParamIsValid, checkIfUserExists, activateUserAccount);

router
  .route('/:id')
  .all(ensureUserParamIsValid, checkIfUserExists)
  .patch(
    userIsActive,
    authenticateUser,
    authorizeAccountOwner,
    validateUsername,
    validateEmail,
    checkIfIdentifierIsInUse,
    updateUserDetails
  )
  .get(authenticateUser, getOneUser)
  .delete(authenticateUser, authorizeAdmin, deleteUser);

export default router;
