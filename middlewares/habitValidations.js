import { Op } from 'sequelize';
import models from '../models';
import { isEmpty, toSentenceCase, uuidTester } from '../helpers';

const { Habits } = models;

const expectedParams = ['userId', 'habitId'];

export default {
  ensureParamsAreNotEmpty(req, res, next) {
    const message = 'params are required but not supplied';
    const emptyParamBody = Object.keys(req.body).length === 0;

    if (emptyParamBody) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }
    return next();
  },

  ensureNameIsProvided(req, res, next) {
    const message = 'name is required but was not supplied';
    const nameIsNotInBody = !Object.keys(req.body).includes('name');

    if (nameIsNotInBody) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }
    return next();
  },

  ensureNameIsNotEmpty(req, res, next) {
    const { name } = req.body;
    const message = 'name should not be empty';

    const nameIsInBody = Object.keys(req.body).includes('name');

    if (nameIsInBody && isEmpty(name)) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }
    return next();
  },

  ensureStartDateProvided(req, res, next) {
    const message = 'startsAt is required but was not supplied';
    const startsAtIsNotInBody = !Object.keys(req.body).includes('startsAt');

    if (startsAtIsNotInBody) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }
    return next();
  },

  ensureStartDateNotEmpty(req, res, next) {
    const { startsAt } = req.body;
    const message = 'startsAt should not be empty';

    const startsAtIsInBody = Object.keys(req.body).includes('startsAt');

    if (startsAtIsInBody && isEmpty(startsAt)) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }
    return next();
  },

  ensureExpiryDateProvided(req, res, next) {
    const message = 'expiresAt is required but was not supplied';
    const expiresAtIsNotInBody = !Object.keys(req.body).includes('expiresAt');

    if (expiresAtIsNotInBody) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }
    return next();
  },

  ensureExpiryDateNotEmpty(req, res, next) {
    const { expiresAt } = req.body;
    const message = 'expiresAt should not be empty';

    const expiresAtIsInBody = Object.keys(req.body).includes('expiresAt');

    if (expiresAtIsInBody && isEmpty(expiresAt)) {
      const error = new Error(message);
      error.status = 400;
      next(error);
    }
    return next();
  },

  async ensureNoSimilarlyNamedHabit(req, res, next) {
    const {
      decoded: { id: userId },
      body: { name }
    } = req;
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
        const error = new Error(message);
        error.status = 409;
        next(error);
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
      const error = new Error(JSON.stringify(invalidParamsArray));
      error.status = 400;
      next(error);
    }
    return next();
  },

  ensureValidUserIdParams(req, res, next) {
    if (!uuidTester(req.params.userId)) {
      const error = new Error('the userId supplied is not a valid uuid');
      error.status = 400;
      next(error);
    }
    next();
  },

  async habitExists(req, res, next) {
    const habit = await Habits.findOne({ where: { id: req.params.habitId } });
    if (!habit) {
      const error = new Error(`No habit with id ${req.params.habitId}`);
      error.status = 404;
      next(error);
    }
    return next();
  },

  async userHabitExists(req, res, next) {
    const {
      params: { habitId, userId }
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

    if (!singleUserHabit) {
      const error = new Error(`No habit with id ${habitId}`);
      error.status = 404;
      next(error);
    }
    next();
  }
};
