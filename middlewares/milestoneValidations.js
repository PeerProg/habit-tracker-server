import { Op } from 'sequelize';
import models from '../models';
import { isEmpty, toSentenceCase } from '../helpers';

const { Milestones } = models;

export default {
  titleIsInBody(req, res, next) {
    if (!Object.keys(req.body).includes('title')) {
      const error = new Error('title is required');
      error.status = 400;
      next(error);
    }
    return next();
  },

  titleIsEmpty(req, res, next) {
    const titleIsPresent = Object.keys(req.body).includes('title');
    if (titleIsPresent && isEmpty(req.body.title)) {
      const error = new Error('title cannot be empty');
      error.status = 400;
      next(error);
    }
    return next();
  },

  async checkIfMilestoneTitleExists(req, res, next) {
    const { habitId } = req.params;
    const title = req.body.title && toSentenceCase(req.body.title);
    const milestone = await Milestones.findOne({
      where: {
        [Op.and]: [
          {
            habitId,
            title
          }
        ]
      }
    });
    if (!title || !milestone) return next();
    const error = new Error('Habit already has a milestone with the same title');
    error.status = 409;
    next(error);
  },

  async checkIfMilestoneIdExists(req, res, next) {
    const { milestoneId, habitId } = req.params;
    const milestone = await Milestones.findOne({
      where: {
        [Op.and]: [
          {
            habitId,
            id: milestoneId
          }
        ]
      }
    });
    if (milestone) return next();
    const error = new Error(`No milestone with id ${milestoneId}`);
    error.status = 404;
    next(error);
  }
};
