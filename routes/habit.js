import express from 'express';
import { habitController } from '../controllers';
import { authentication, habitValidations, authorization } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const { authorizeHabitOwnerOrAdmin, authorizeHabitOwner } = authorization;
const {
  ensureNameAndMilestonesSupplied,
  ensureNonNullFields,
  ensureNoSimilarlyNamedHabit,
  ensurePositiveIntegerParams
} = habitValidations;
const {
  createNewHabit,
  getUserHabits,
  getOneUserHabit,
  deleteOneUserHabit,
  editOneUserHabit
} = habitController;

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
  .get(authorizeHabitOwnerOrAdmin, getUserHabits);

router.route('/user/:id/:habitID')
  .all(authenticateUser, ensurePositiveIntegerParams, authorizeHabitOwner)
  .get(getOneUserHabit)
  .put(ensureNonNullFields, ensureNoSimilarlyNamedHabit, editOneUserHabit)
  .delete(deleteOneUserHabit);

export default router;
