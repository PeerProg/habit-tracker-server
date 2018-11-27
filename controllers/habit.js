import { Op } from 'sequelize';
import models from '../models';
import { toSentenceCase } from '../helpers';

const { Habits } = models;

export default {
  async createNewHabit(req, res) {
    const { body: { name, milestones }, decoded: { id: userId } } = req;
    const normalizedName = toSentenceCase(name);
    const normalizedMilestones = milestones.map(milestone => toSentenceCase(milestone));

    const newHabit = await Habits.create({
      name: normalizedName,
      milestones: normalizedMilestones,
      userId
    });
    return res.status(201).send(newHabit);
  },

  async getUserHabits(req, res) {
    const { params: { id: userId } } = req;
    const userHabits = await Habits.findAll({
      where: {
        userId,
      }
    });
    const hasHabitsCreated = await userHabits.length;
    if (!hasHabitsCreated) {
      return res.status(404).send({ message: 'No habits created yet' });
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
  },

  async editOneUserHabit(req, res) {
    // Ensure to always prepopulate with data from DB so it is available in req.body
    // When updating, we are always replacing because of the minimalist structure of the models
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

    const incomingMilestones = req.body.milestones;
    const newMilestones = incomingMilestones.map(mstone => toSentenceCase(mstone));
    const replacementMilestones = [...new Set(newMilestones)];

    const editedHabit = await singleUserHabit.update({
      name: (req.body.name && toSentenceCase(req.body.name)) || singleUserHabit.name,
      milestones: replacementMilestones
    });

    return res.send({
      name: editedHabit.name,
      milestones: editedHabit.milestones,
      createdAt: editedHabit.createdAt,
      updatedAt: editedHabit.updatedAt
    });
  },
};
