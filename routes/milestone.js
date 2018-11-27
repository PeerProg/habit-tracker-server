import express from 'express';
import { milestoneController } from '../controllers';
import { habitValidations, authentication , authorization } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const { authorizeHabitOwner } = authorization;
const { getHabitMilestones } = milestoneController;
const { habitExists } = habitValidations;

router.route('/:habitId/milestones')
  .get(authenticateUser, habitExists, authorizeHabitOwner, getHabitMilestones);

export default router;
