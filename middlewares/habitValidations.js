import { Op } from 'sequelize';
import models from '../models';

const { Users, Habits } = models;

export default {
  async hasSimilarlyNamedHabit(req, res, next) {
    const { decoded: { id: userId }, body: { name } } = req;
    const habit = await Habits.findOne({
      where: {
        [Op.and]: [
          {
            userId,
            name
          }
        ]
      }
    });
    const alreadyExists = habit.get('name').toLowerCase().trim() === name.toLowerCase().trim();
    if (alreadyExists) {
      return res.status(409).json({ message: 'You already have an habit with that name' });
    }
    return next();
  },
};
