import { Op } from 'sequelize';
import models from '../models';
import { toSentenceCase } from '../helpers';

const { Habits } = models;

export default {
  async createNewHabit(req, res) {
    const {
      body: { name, startsAt, expiresAt },
      decoded: { id: userId }
    } = req;
    const normalizedName = toSentenceCase(name);
    const data = await Habits.create({
      name: normalizedName,
      startsAt,
      expiresAt,
      userId
    });

    return res.status(201).send({ data, status: 201 });
  },

  async getUserHabits(req, res) {
    const {
      params: { userId }
    } = req;
    const userHabits = await Habits.findAll({ where: { userId } });

    const data = userHabits.map(habit => ({
      name: habit.name,
      startsAt: habit.startsAt,
      expiresAt: habit.expiresAt,
      habitActive: habit.habitActive,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      habitId: habit.id
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

    const singleUserHabit = await Habits.findOne({ where: queryParam });

    const data = {
      name: singleUserHabit.name,
      startsAt: singleUserHabit.startsAt,
      expiresAt: singleUserHabit.expiresAt,
      habitActive: singleUserHabit.habitActive,
      createdAt: singleUserHabit.createdAt,
      updatedAt: singleUserHabit.updatedAt
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

    const singleUserHabit = await Habits.findOne({ where: queryParam });

    const nameUnchanged =
      !Object.keys(req.body).includes('name') ||
      toSentenceCase(req.body.name) === singleUserHabit.name;

    if (nameUnchanged) {
      return res.status(304).send({ status: 304 });
    }

    const editedHabit = await singleUserHabit.update({
      name: req.body.name && toSentenceCase(req.body.name)
    });

    const data = {
      name: editedHabit.name,
      startsAt: editedHabit.startsAt,
      expiresAt: editedHabit.expiresAt,
      createdAt: editedHabit.createdAt,
      updatedAt: editedHabit.updatedAt
    };

    return res.send({ data, status: 200 });
  }
};
