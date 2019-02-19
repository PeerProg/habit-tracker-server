import express from 'express';
import { habitController } from '../controllers';
import {
  authentication,
  habitValidations,
  authorization
} from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const { authorizeHabitOwnerOrAdmin, authorizeHabitOwner } = authorization;
const {
  ensureParamsAreNotEmpty,
  ensureNameIsProvided,
  ensureNameIsNotEmpty,
  ensureStartDateProvided,
  ensureStartDateNotEmpty,
  ensureExpiryDateProvided,
  ensureExpiryDateNotEmpty,
  ensureValidUserIdParams,
  ensureNoSimilarlyNamedHabit,
  ensureValidParams,
  ensureValidValueOfHabitActive,
  userHabitExists
} = habitValidations;

const {
  createNewHabit,
  getUserHabits,
  getOneUserHabit,
  deleteOneUserHabit,
  editOneUserHabit
} = habitController;

router
  .route('/create')
  .post(
    authenticateUser,
    ensureParamsAreNotEmpty,
    ensureNameIsProvided,
    ensureNameIsNotEmpty,
    ensureStartDateProvided,
    ensureStartDateNotEmpty,
    ensureExpiryDateProvided,
    ensureExpiryDateNotEmpty,
    ensureNoSimilarlyNamedHabit,
    createNewHabit
  );

router
  .route('/user/:userId/all-habits')
  .get(
    ensureValidUserIdParams,
    authenticateUser,
    authorizeHabitOwnerOrAdmin,
    getUserHabits
  );

router
  .route('/user/:userId/:habitId')
  .all(
    ensureValidParams,
    authenticateUser,
    userHabitExists,
    authorizeHabitOwner
  )
  .get(getOneUserHabit)
  .patch(
    ensureNameIsNotEmpty,
    ensureNoSimilarlyNamedHabit,
    ensureValidValueOfHabitActive,
    editOneUserHabit
  )
  .delete(deleteOneUserHabit);

export default router;
