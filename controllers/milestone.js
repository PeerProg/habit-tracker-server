import models from '../models';

const { Habits, Milestone } = models;

export default {
  async getHabitMilestones(req, res) {
    await Habits.findOne({ where: { id: req.params.habitId } });
    const milestones = await Milestone.findAll({
      where: {
        habitId: req.params.habitId
      }
    });

    const responseArray = milestones.map(milestone => ({
      title: milestone.title,
      completed: milestone.completed,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt
    }));

    return res.send(responseArray);
  }
};
