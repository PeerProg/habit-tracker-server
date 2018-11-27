import express from 'express';
import { milestoneController } from '../controllers';
import { habitValidations, authentication, milestoneValidations } from '../middlewares';

const router = express.Router();

const { authenticateUser } = authentication;
const {
  getHabitMilestones,
  addMilestone,
  deleteMilestone,
  updateMilestone,
  getMilestone
} = milestoneController;
const { habitExists } = habitValidations;
const {
  checkIfMilestoneTitleExists,
  checkIfMilestoneIdExists,
  titleIsInBody,
  titleIsEmpty
} = milestoneValidations;

router.get(
  '/:habitId/milestones',
  authenticateUser,
  habitExists,
  getHabitMilestones
);

router.get(
  '/:habitId/get/:milestoneId',
  authenticateUser,
  habitExists,
  checkIfMilestoneIdExists,
  getMilestone
);

router.put(
  '/:habitId/edit/:milestoneId',
  authenticateUser,
  habitExists,
  checkIfMilestoneIdExists,
  titleIsEmpty,
  checkIfMilestoneTitleExists,
  updateMilestone
);

router.post(
  '/:habitId/add',
  authenticateUser,
  habitExists,
  titleIsInBody,
  titleIsEmpty,
  checkIfMilestoneTitleExists,
  addMilestone
);

router.delete(
  '/:habitId/delete/:milestoneId',
  authenticateUser,
  habitExists,
  checkIfMilestoneIdExists,
  deleteMilestone
);


export default router;
