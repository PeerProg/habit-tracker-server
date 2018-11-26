import models from '../models';

const { Users, Habits } = models;

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
  }
};
