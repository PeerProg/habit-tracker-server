import { Op } from 'sequelize';
import models from '../models';
import { toSentenceCase } from '../helpers';

const { Habits } = models;

export default {
  async createNewHabit(req, res) {
    const { body: { name }, decoded: { id: userId } } = req;
    const normalizedName = toSentenceCase(name);

    const newHabit = await Habits.create({ name: normalizedName, userId });
    return res.status(201).send(newHabit);
  },

  async getUserHabits(req, res) {
    const { params: { userId } } = req;
    const userHabits = await Habits.findAll({ where: { userId } });
    const hasHabitsCreated = await userHabits.length;
    if (!hasHabitsCreated) {
      return res.status(404).send({ message: 'No habits created yet' });
    }

    const responseArray = (userHabits).map(habit => ({
      name: habit.name,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      habitId: habit.id
    }));

    return res.send(responseArray);
  },

  async getOneUserHabit(req, res) {
    const { params: { habitId }, decoded: { id: userId } } = req;
    const singleUserHabit = await Habits.findOne({
      where: {
        [Op.and]: [
          {
            userId,
            id: habitId
          }
        ]
      }
    });

    if (!singleUserHabit) {
      return res.status(404).send({ message: `No habit with id ${habitId}` });
    }

    const responseObject = {
      name: singleUserHabit.name,
      createdAt: singleUserHabit.createdAt,
      updatedAt: singleUserHabit.updatedAt
    };

    return res.send(responseObject);
  },

  async deleteOneUserHabit(req, res) {
    const { params: { habitId }, decoded: { id: userId } } = req;

    const queryParam = {
      [Op.and]: [
        {
          userId,
          id: habitId
        }
      ]
    };

    const singleUserHabit = await Habits.findOne({ where: queryParam });

    if (!singleUserHabit) {
      return res.status(404).send({ message: `No habit with id ${habitId}` });
    }

    await Habits.destroy({ where: queryParam });

    return res.send({ message: 'Habit deleted' });
  },

  async editOneUserHabit(req, res) {
    // Ensure to always prepopulate with data from DB so it is available in req.body
    // When updating, we are always replacing because of the minimalist structure of the models
    const { params: { habitId }, decoded: { id: userId } } = req;
    const queryParam = {
      [Op.and]: [
        {
          userId,
          id: habitId
        }
      ]
    };

    const singleUserHabit = await Habits.findOne({ where: queryParam });

    if (!singleUserHabit) {
      return res.status(404).send({ message: `No habit with id ${habitId}` });
    }

    const nameUnchanged = !Object.keys(req.body).includes('name') ||
      (toSentenceCase(req.body.name) === singleUserHabit.name);

    if (nameUnchanged) {
      return res.sendStatus(304);
    }

    const editedHabit = await singleUserHabit.update({
      name: (req.body.name && toSentenceCase(req.body.name))
    });

    return res.send({
      name: editedHabit.name,
      createdAt: editedHabit.createdAt,
      updatedAt: editedHabit.updatedAt
    });
  },
};
