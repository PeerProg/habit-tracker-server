import express from 'express';
import { habitController } from '../controllers';
import { authentication, habitValidations } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const {
  ensureNameAndMilestonesSupplied,
  ensureNonNullFields,
  ensureNoSimilarlyNamedHabit
} = habitValidations;
const { getAllHabits, createNewHabit } = habitController;

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


export default router;
