import Sequelize, { Op } from 'sequelize';
import models from '../models';
import { toSentenceCase, toBooleanValue } from '../helpers';
import Notifier from '../utilities';

const { Habits, Milestones, Notifications } = models;
const { notifyHabitCreation } = Notifier;

export default {
  async createNewHabit(req, res) {
    const {
      body: { name, startsAt, expiresAt },
      decoded: { id: userId }
    } = req;
    const normalizedName = toSentenceCase(name);
    const createNotification = notifyHabitCreation(name);

    const data = await Habits.create({
      name: normalizedName,
      startsAt,
      expiresAt,
      userId
    });
    const notificationData = await Notifications.create({
      title: createNotification.Title,
      message: createNotification.Message
    });
    return res.status(201).send({ data, notificationData, status: 201 });
  },

  async getUserHabits(req, res) {
    const {
      params: { userId }
    } = req;
    const userHabits = await Habits.findAll({
      where: { userId },
      include: [
        {
          model: Milestones,
          required: false,
          attributes: ['id', 'title', 'completed', 'createdAt', 'updatedAt']
        }
      ],
      order: Sequelize.col('createdAt')
    });

    const data = userHabits.map(habit => ({
      name: habit.name,
      startsAt: habit.startsAt,
      expiresAt: habit.expiresAt,
      habitActive: habit.habitActive,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      habitId: habit.id,
      milestones: habit.Milestones
    }));

    return res.send({ data, status: 200 });
  },

  async getOneUserHabit(req, res) {
    const {
      params: { habitId },
      decoded: { id: userId }
    } = req;

    const queryParam = {
      [Op.and]: [
        {
          userId,
          id: habitId
        }
      ]
    };

    const singleUserHabit = await Habits.findOne({
      where: queryParam,
      include: [
        {
          model: Milestones,
          required: false,
          attributes: ['id', 'title', 'completed', 'createdAt', 'updatedAt']
        }
      ],
      order: Sequelize.col('createdAt')
    });

    const data = {
      name: singleUserHabit.name,
      startsAt: singleUserHabit.startsAt,
      expiresAt: singleUserHabit.expiresAt,
      habitActive: singleUserHabit.habitActive,
      createdAt: singleUserHabit.createdAt,
      updatedAt: singleUserHabit.updatedAt,
      milestones: singleUserHabit.Milestones
    };

    return res.send({ data, status: 200 });
  },

  async deleteOneUserHabit(req, res) {
    const {
      params: { habitId },
      decoded: { id: userId }
    } = req;

    const queryParam = {
      [Op.and]: [
        {
          userId,
          id: habitId
        }
      ]
    };

    await Habits.destroy({ where: queryParam });

    return res.send({ message: 'Habit deleted', status: 200 });
  },

  async editOneUserHabit(req, res) {
    const {
      params: { habitId },
      decoded: { id: userId }
    } = req;
    const queryParam = {
      [Op.and]: [
        {
          userId,
          id: habitId
        }
      ]
    };

    const singleUserHabit = await Habits.findOne({
      where: queryParam,
      include: [
        {
          model: Milestones,
          required: false,
          attributes: ['id', 'title', 'completed', 'createdAt', 'updatedAt']
        }
      ],
      order: Sequelize.col('createdAt')
    });
    const nameUnchanged =
      !Object.keys(req.body).includes('name') ||
      toSentenceCase(req.body.name) === singleUserHabit.name;

    const habitStatusUnchanged =
      !Object.keys(req.body).includes('habitActive') ||
      toBooleanValue(req.body.habitActive) === singleUserHabit.habitActive;

    if (nameUnchanged && habitStatusUnchanged) {
      return res.status(304).send({ status: 304 });
    }

    const editedHabitStatus =
      req.body.habitActive && toBooleanValue(req.body.habitActive);
    const editedHabitName = req.body.name && toSentenceCase(req.body.name);

    const editedHabit = await singleUserHabit.update({
      name: editedHabitName || singleUserHabit.name,
      habitActive: editedHabitStatus
    });

    const data = {
      name: editedHabit.name,
      startsAt: editedHabit.startsAt,
      expiresAt: editedHabit.expiresAt,
      habitActive: editedHabit.habitActive,
      createdAt: editedHabit.createdAt,
      updatedAt: editedHabit.updatedAt,
      milestones: editedHabit.Milestones
    };

    return res.send({ data, status: 200 });
  }
};
