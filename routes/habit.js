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
  ensureNameIsProvided,
  ensureNameIsNotEmpty,
  ensureValidUserIdParams,
  ensureNoSimilarlyNamedHabit,
  ensureValidParams,
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
    ensureNameIsProvided,
    ensureNameIsNotEmpty,
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
  .put(ensureNameIsNotEmpty, ensureNoSimilarlyNamedHabit, editOneUserHabit)
  .delete(deleteOneUserHabit);

export default router;
