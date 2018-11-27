import supertest from 'supertest';
import app from '../app';
import models from '../models';
import { resourceCreator, toSentenceCase } from '../helpers';

const request = supertest.agent(app);

const superAdmin = resourceCreator.createSuperAdmin();
const adminUser = resourceCreator.createAdminUser();
const regularUserOne = resourceCreator.createRegularUser();
const habitBodyObjectOne = resourceCreator.createNewHabit();
const habitBodyObjectTwo = resourceCreator.createProperHabit();

const signupRoute = '/api/v1/user/register';
const baseHabitRoute = '/api/v1/habit';

describe('THE HABITS TEST SUITE', () => {
  let superAdminToken;
  let adminToken;
  let regularUserOneToken;

  beforeAll(async (done) => {
    const response = await request.post(signupRoute).send(superAdmin);
    superAdminToken = response.body.token;
    const result = await request.post(signupRoute).send(adminUser);
    adminToken = result.body.token;
    const resp = await request.post(signupRoute).send(regularUserOne);
    regularUserOneToken = resp.body.token;
    done();
  });

  afterAll(() => models.sequelize.sync({ force: true }));

  describe('CREATION OF HABITS: /api/v1/habit/create', () => {
    it('Should fail creation when no data is provided', async (done) => {
      const response = await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({});
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual('name is required but was not supplied');
      done();
    });

    it('Should fail creation when any required field is empty', async (done) => {
      const response = await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({ name: '' });
      expect(response.status).toBe(403);
      expect(response.body.error).toEqual('name should not be empty');
      done();
    });

    it('Should fail creation when user has similarly named habit', async (done) => {
      await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectOne);
      const response = await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectOne);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('You already have an habit with that name');
      done();
    });

    it('Should allow a user create an habit successfully', async (done) => {
      const response = await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: superAdminToken })
        .send(habitBodyObjectOne);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', toSentenceCase(habitBodyObjectOne.name));
      done();
    });
  });

  describe('GET ALL USER HABITS: /api/v1/habit/user/:userId/all-habits', () => {
    it('Should return a message when user has no habits yet', async (done) => {
      const response = await request.get(`${baseHabitRoute}/user/2/all-habits`)
        .set({ Authorization: adminToken });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'No habits created yet');
      done();
    });

    it('Should not get habits when userId param is invalid', async (done) => {
      const response = await request.get(`${baseHabitRoute}/user/-3/all-habits`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(400);
      expect(response.body.error).toEqual('userId must be a positive integer');
      done();
    });

    it('Should allow a user get a list of his/her habits', async (done) => {
      await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectOne);
      await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectTwo);
      const response = await request.get(`${baseHabitRoute}/user/3/all-habits`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toEqual(habitBodyObjectOne.name);
      done();
    });

    it('Should allow an admin can get a list of a user\'s habits', async (done) => {
      await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectOne);
      await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectTwo);
      const response = await request.get(`${baseHabitRoute}/user/3/all-habits`)
        .set({ Authorization: adminToken });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[1].name).toEqual(habitBodyObjectTwo.name);
      done();
    });

    it('Should should restrict access to user\'s habits for non-admins', async (done) => {
      await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: superAdminToken })
        .send(habitBodyObjectOne);
      const response = await request.get(`${baseHabitRoute}/user/1/all-habits`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Not authorized');
      done();
    });
  });

  describe(`GET SINGLE USER HABIT: ${baseHabitRoute}/user/:userId/:habitId`, () => {
    it('Should not permit GET for a non-existent habit', async (done) => {
      const response = await request.get(`${baseHabitRoute}/user/3/156`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No habit with id 156');
      done();
    });

    it('Should allow a user get a single habit when required params are provided', async (done) => {
      await request.post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectTwo);
      const response = await request.get(`${baseHabitRoute}/user/3/3`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(habitBodyObjectTwo.name);
      done();
    });

    it('Should ensure that only a user is able to get a single one of their habits', async (done) => {
      const response = await request.get(`${baseHabitRoute}/user/3/3`)
        .set({ Authorization: superAdminToken });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Not authorized');
      done();
    });
  });

  describe(`EDIT USER HABITS: ${baseHabitRoute}/user/:userId/:habitId`, () => {
    it('Should prevent unfettered access to editing a user\'s habits', async (done) => {
      const response = await request.put(`${baseHabitRoute}/user/3/3`)
        .set({ Authorization: superAdminToken })
        .send({ name: 'Perform chores' });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Not authorized');
      done();
    });

    it('Should not allow editing of a non-existent habit', async (done) => {
      const response = await request.put(`${baseHabitRoute}/user/3/15`)
        .set({ Authorization: regularUserOneToken })
        .send({ name: 'Perform chores' });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No habit with id 15');
      done();
    });

    it('Should not allow editing when the user has similarly named habit', async (done) => {
      const response = await request.put(`${baseHabitRoute}/user/3/3`)
        .set({ Authorization: regularUserOneToken })
        .send({ name: habitBodyObjectOne.name });
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'You already have an habit with that name');
      done();
    });

    it('Should not allow habit update for negative params', async (done) => {
      const response = await request.put(`${baseHabitRoute}/user/-3/-4`)
        .set({ Authorization: regularUserOneToken })
        .send({ milestones: ['Buy groceries', 'Go to bank'] });
      expect(response.status).toBe(403);
      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0]).toEqual('userId must be a positive integer');
      expect(response.body.errors[1]).toEqual('habitId must be a positive integer');
      done();
    });

    it('Should allow habit update even if name is not supplied', async (done) => {
      const response = await request.put(`${baseHabitRoute}/user/3/3`)
        .set({ Authorization: regularUserOneToken })
        .send({ });
      expect(response.status).toBe(304);
      done();
    });

    it('Should allow habit name update when name does not already exist', async (done) => {
      const response = await request.put(`${baseHabitRoute}/user/3/3`)
        .set({ Authorization: regularUserOneToken })
        .send({ name: 'Stoop to conquer' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Stoop to conquer');
      done();
    });
  });

  describe(`DELETE USER HABITS: ${baseHabitRoute}/user/:userId/:habitId`, () => {
    it('Should prevent deletion of a habit that does not exist', async (done) => {
      const response = await request.delete(`${baseHabitRoute}/user/3/15`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No habit with id 15');
      done();
    });

    it('Should allow the successful deletion of an habit for authorized person', async (done) => {
      const response = await request.delete(`${baseHabitRoute}/user/3/3`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Habit deleted');
      done();
    });
  });
});
