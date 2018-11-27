import { Op } from 'sequelize';
import models from '../models';
import { isEmpty, toSentenceCase } from '../helpers';

const { Milestone } = models;

export default {
  titleIsInBody(req, res, next) {
    if (!Object.keys(req.body).includes('title')) {
      return res.send({ error: 'title is required' });
    }
    return next();
  },

  titleIsEmpty(req, res, next) {
    const titleIsPresent = Object.keys(req.body).includes('title');
    if (titleIsPresent && isEmpty(req.body.title)) {
      return res.send({ error: 'title cannot be empty' });
    }
    return next();
  },

  async checkIfMilestoneTitleExists(req, res, next) {
    const { habitId } = req.params;
    const title = req.body.title && toSentenceCase(req.body.title);
    const milestone = await Milestone.findOne({
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
    return res.send({ message: 'Habit already has a milestone with the same title' });
  },

  async checkIfMilestoneIdExists(req, res, next) {
    const { milestoneId, habitId } = req.params;
    const milestone = await Milestone.findOne({
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
    return res.send({ message: `No milestone with id ${milestoneId}` });
  }
};
