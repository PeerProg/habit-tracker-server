import { Op } from 'sequelize';
import models from '../models';
import { isEmpty, toSentenceCase, uuidTester } from '../helpers';

const { Habits } = models;

const expectedParams = ['userId', 'habitId'];

export default {
  ensureNameIsProvided(req, res, next) {
    const error = 'name is required but was not supplied';
    const nameIsInNotBody = !Object.keys(req.body).includes('name');

    if (nameIsInNotBody) return res.status(403).json({ error });
    return next();
  },

  ensureNameIsNotEmpty(req, res, next) {
    const { name } = req.body;
    const error = 'name should not be empty';

    const nameIsInBody = Object.keys(req.body).includes('name');

    if (nameIsInBody && isEmpty(name)) return res.status(403).json({ error });
    return next();
  },

  async ensureNoSimilarlyNamedHabit(req, res, next) {
    const { decoded: { id: userId }, body: { name } } = req;
    const message = 'You already have an habit with that name';

    if ('name' in req.body) {
      const habit = await Habits.findOne({
        where: {
          [Op.and]: [
            {
              userId,
              name: toSentenceCase(name)
            }
          ]
        }
      });

      if (habit && habit.get('name') === toSentenceCase(name)) {
        return res.status(409).json({ message });
      }
      return next();
    }
    return next();
  },

  ensureValidParams(req, res, next) {
    const invalidParamsArray = [];

    expectedParams.forEach(param => {
      if (!uuidTester(req.params[param])) {
        invalidParamsArray.push(`${param} is not a valid uuid`);
      }
    });

    if (invalidParamsArray.length) {
      return res.status(403).json({ errors: invalidParamsArray });
    }
    return next();
  },

  ensureValidUserIdParam(req, res, next) {
    if (!uuidTester(req.params.userId)) {
      return res.status(400).json({ error: 'the userId supplied is not a valid uuid' });
    }
    next();
  },

  async habitExists(req, res, next) {
    const habit = await Habits.findOne({ where: { id: req.params.habitId } });
    if (!habit) return res.status(404).send({ message: `No habit with id ${req.params.habitId}` });
    return next();
  }
};
