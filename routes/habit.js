import express from 'express';
import { habitController } from '../controllers';
import { authentication, habitValidations } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const { hasSimilarlyNamedHabit } = habitValidations;
const { getAllHabits, createNewHabit } = habitController;

router.route('/all')
  .get(authenticateUser, getAllHabits);

router.route('/create')
  .post(authenticateUser, hasSimilarlyNamedHabit, createNewHabit);


export default router;
