import { Op } from 'sequelize';
import models from '../models';

const { Habits } = models;

export default {
  async getAllHabits(req, res) {
    const habits = await Habits.findAll();
    if (!habits.length) return res.status(404).json({ message: 'No habits created yet' });
    const responseArray = habits.map(habit => ({
      name: habit.name,
      milestones: habit.milestones,
      userId: habit.userId,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt
    }));

    return res.send(responseArray);
  },

  async createNewHabit(req, res) {
    const { body: { name, milestones }, decoded: { id: userId } } = req;
    const newHabit = await Habits.create({
      name,
      milestones,
      userId
    });
    return res.send(newHabit);
  },

  async getUserHabits(req, res) {
    const { decoded: { id: userId } } = req;
    const userHabits = await Habits.findAll({
      where: {
        userId,
      }
    });
    const hasHabitsCreated = await userHabits.length;
    if (!hasHabitsCreated) {
      return res.status(404).send({ message: 'You have no habits created for tracking yet' });
    }

    const responseArray = (userHabits).map(habit => ({
      name: habit.name,
      milestones: habit.milestones,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      habitID: habit.id
    }));

    return res.send(responseArray);
  },

  async getOneUserHabit(req, res) {
    const { params: { habitID }, decoded: { id: userId } } = req;
    const singleUserHabit = await Habits.findOne({
      where: {
        [Op.and]: [
          {
            userId,
            id: habitID
          }
        ]
      }
    });

    if (!singleUserHabit) {
      return res.status(404).send({ message: `No habit with id ${habitID}` });
    }

    const responseObject = {
      name: singleUserHabit.name,
      milestones: singleUserHabit.milestones,
      createdAt: singleUserHabit.createdAt,
      updatedAt: singleUserHabit.updatedAt
    };

    return res.send(responseObject);
  },

  async deleteOneUserHabit(req, res) {
    const { params: { habitID }, decoded: { id: userId } } = req;

    const queryParam = {
      [Op.and]: [
        {
          userId,
          id: habitID
        }
      ]
    };

    const singleUserHabit = await Habits.findOne({ where: queryParam });

    if (!singleUserHabit) {
      return res.status(404).send({ message: `No habit with id ${habitID}` });
    }

    await Habits.destroy({ where: queryParam });

    return res.send({ message: 'Habit deleted' });
  }
};
