import express from 'express';
import { habitController } from '../controllers';
import { authentication, habitValidations, authorization } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const {
  ensureNameAndMilestonesSupplied,
  ensureNonNullFields,
  ensureNoSimilarlyNamedHabit,
  ensurePositiveIntegerParams
} = habitValidations;
const {
  getAllHabits,
  createNewHabit,
  getUserHabits,
  getOneUserHabit
} = habitController;

router.route('/all')
  .get(authenticateUser, getAllHabits);

router.route('/create')
  .post(
    authenticateUser,
    ensureNameAndMilestonesSupplied,
    ensureNonNullFields,
    ensureNoSimilarlyNamedHabit,
    createNewHabit
  );

router.route('/user/:id/all-habits')
  .all(authenticateUser)
  .get(authorization.authorizeHabitOwner, getUserHabits);

router.route('/user/:id/:habitID')
  .all(authenticateUser)
  .get(authorization.authorizeHabitOwner, ensurePositiveIntegerParams, getOneUserHabit);


export default router;
