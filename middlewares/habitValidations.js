import { Op } from 'sequelize';
import models from '../models';
import { isEmpty, toSentenceCase } from '../helpers';

const { Habits } = models;

const expectedFields = ['name', 'milestones'];
const expectedParams = ['id', 'habitID'];
const isPositiveInteger = (val) => Number.isInteger(Number(val)) && Number(val) > 0;

export default {
  async ensureNameAndMilestonesSupplied(req, res, next) {
    const requiredFieldsArray = [];

    expectedFields.forEach(field => {
      if (!Object.keys(req.body).includes(field)) {
        requiredFieldsArray.push(`${field} is required but was not supplied`);
      }
    });

    if (requiredFieldsArray.length) {
      return res.status(403).json({ errors: requiredFieldsArray });
    }
    return next();
  },

  async ensureNonNullFields(req, res, next) {
    const nullFieldsArray = [];

    expectedFields.forEach(field => {
      if (Object.keys(req.body).includes(field)) {
        const fieldValue = req.body[field];
        if (isEmpty(fieldValue)) {
          nullFieldsArray.push(`${field} should not be empty`);
        }
      }
    });

    if (nullFieldsArray.length) {
      return res.status(403).json({ errors: nullFieldsArray });
    }
    return next();
  },

  async ensureNoSimilarlyNamedHabit(req, res, next) {
    const { decoded: { id: userId } } = req;
    if (Object.keys(req.body).includes('name')) {
      const habit = await Habits.findOne({
        where: {
          [Op.and]: [
            {
              userId,
              name: toSentenceCase(req.body.name)
            }
          ]
        }
      });

      if (habit && habit.get('name') === toSentenceCase(req.body.name)) {
        return res.status(409).json({ message: 'You already have an habit with that name' });
      }
      return next();
    }
    return next();
  },

  async ensurePositiveIntegerParams(req, res, next) {
    const nonNumberErrorArray = [];

    expectedParams.forEach(param => {
      if (!isPositiveInteger(req.params[param])) {
        nonNumberErrorArray.push(`${param} must be a positive integer`);
      }
    });

    if (nonNumberErrorArray.length) {
      return res.status(403).json({ errors: nonNumberErrorArray });
    }
    return next();
  }
};
