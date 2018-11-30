import { Op } from 'sequelize';
import models from '../models';
import { toSentenceCase } from '../helpers';

const { Habits, Milestone } = models;

export default {
  async getHabitMilestones(req, res) {
    await Habits.findOne({ where: { id: req.params.habitId } });
    const milestones = await Milestone.findAll({
      where: {
        habitId: req.params.habitId
      }
    });

    const data = milestones.map(milestone => ({
      title: milestone.title,
      completed: milestone.completed,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt
    }));

    return res.json({ data, status: 200 });
  },

  async addMilestone(req, res) {
    const { habitId } = req.params;
    const title = toSentenceCase(req.body.title);
    const newMilestone = await Milestone.create({ title, habitId });

    const data = {
      id: newMilestone.id,
      title: newMilestone.title,
      completed: newMilestone.completed,
      createdAt: newMilestone.createdAt,
      updatedAt: newMilestone.updatedAt,
    };

    return res.json({ data, status: 200 });
  },

  async getMilestone(req, res) {
    const { habitId, milestoneId } = req.params;
    const milestone = await Milestone.findOne({
      where: {
        [Op.and]: [
          {
            id: milestoneId,
            habitId
          }
        ]
      }
    });

    const data = {
      id: milestone.id,
      title: milestone.title,
      completed: milestone.completed,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt,
    };

    return res.json({ data, status: 200 });
  },

  async updateMilestone(req, res) {
    const { habitId, milestoneId } = req.params;
    const milestone = await Milestone.findOne({
      where: {
        [Op.and]: [
          {
            id: milestoneId,
            habitId
          }
        ]
      }
    });
    const title = req.body.title && toSentenceCase(req.body.title);
    const updatedMilestone = await milestone.update({
      title: title || milestone.title,
      completed: req.body.completed || milestone.completed
    });

    const data = {
      id: updatedMilestone.id,
      title: updatedMilestone.title,
      completed: updatedMilestone.completed,
      createdAt: updatedMilestone.createdAt,
      updatedAt: updatedMilestone.updatedAt,
    };

    return res.json({ data, status: 200 });
  },

  async deleteMilestone(req, res) {
    const { habitId, milestoneId } = req.params;
    const milestone = await Milestone.findOne({
      where: {
        [Op.and]: [
          {
            id: milestoneId,
            habitId
          }
        ]
      }
    });
    await milestone.destroy();

    return res.json({ message: 'Milestone deleted', status: 200 });
  }
};
