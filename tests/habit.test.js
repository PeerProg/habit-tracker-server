import supertest from 'supertest';
import app from '../app';
import models from '../models';
import { resourceCreator, toSentenceCase } from '../helpers';

const request = supertest.agent(app);

const habit404UUID = resourceCreator.habit404UUID();
const superAdmin = resourceCreator.createSuperAdmin();
const adminUser = resourceCreator.createAdminUser();
const regularUserOne = resourceCreator.createRegularUser();
const habitBodyObjectOne = resourceCreator.createNewHabit();
const habitBodyObjectTwo = resourceCreator.createProperHabit();
const habitBodyObjectThree = resourceCreator.createHabit();

const signupRoute = '/api/v1/user/register';
const baseHabitRoute = '/api/v1/habit';

describe('THE HABITS TEST SUITE', () => {
  let superAdminToken;
  let superAdminId;
  let adminToken;
  let adminId;
  let regularUserOneToken;
  let regularUserId;
  let adminHabitId;

  beforeAll(async done => {
    const response = await request.post(signupRoute).send(superAdmin);
    superAdminToken = response.body.data.token;
    superAdminId = response.body.data.id;
    const result = await request.post(signupRoute).send(adminUser);
    adminToken = result.body.data.token;
    adminId = result.body.data.id;
    const resp = await request.post(signupRoute).send(regularUserOne);
    regularUserOneToken = resp.body.data.token;
    regularUserId = resp.body.data.id;
    await request
      .post(`${baseHabitRoute}/create`)
      .set({ Authorization: regularUserOneToken })
      .send(habitBodyObjectOne);
    done();
  });

  afterAll(() => models.sequelize.sync({ force: true }));

  describe('CREATION OF HABITS: /api/v1/habit/create', () => {
    it('Should fail creation when no data is provided', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual('params are required but not supplied');
      done();
    });

    it('Should fail creation when the name data is not provided', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({
          startsAt: 'January 12th 2019, 12:00:59 pm',
          expiresAt: '1/21/2019'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual('name is required but was not supplied');
      done();
    });

    it('Should fail creation when the expiresAt data is not provided', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({
          name: 'Ayotunde',
          startsAt: 'January 12th 2019, 12:00:59 pm'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual('expiresAt is required but was not supplied');
      done();
    });

    it('Should fail creation when the startsAt data is not provided', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({
          name: 'Ayotunde',
          expiresAt: '1/21/2019'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual('startsAt is required but was not supplied');
      done();
    });

    it('Should fail creation when name is empty', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({
          name: '',
          startsAt: 'January 12th 2019, 12:00:59 pm',
          expiresAt: '1/21/2019'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual('name should not be empty');
      done();
    });

    it('Should fail creation when expiresAt is empty', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({
          name: 'Ayotunde',
          startsAt: 'January 12th 2019, 12:00:59 pm',
          expiresAt: ''
        });
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual('expiresAt should not be empty');
      done();
    });

    it('Should fail creation when startsAt is empty', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send({
          name: 'Tunde',
          expiresAt: '1/21/2019',
          startsAt: ''
        });
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual('startsAt should not be empty');
      done();
    });

    it('Should fail creation when user has similarly named habit', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectOne);
      expect(response.status).toBe(409);
      expect(response.body.error.message).toEqual('You already have an habit with that name');
      done();
    });

    it('Should allow a user create an habit successfully', async done => {
      const response = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: superAdminToken })
        .send(habitBodyObjectOne);
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty(
        'name',
        'expiresAt',
        'startsAt',
        toSentenceCase(habitBodyObjectOne.name)
      );
      done();
    });
  });

  describe('GET ALL USER HABITS: /api/v1/habit/user/:userId/all-habits', () => {
    it('Should not get habits when userId param is invalid', async done => {
      const response = await request
        .get(`${baseHabitRoute}/user/-3/all-habits`)
        .set({ Authorization: regularUserOneToken });
      const errorMessage = response.body.error.message;
      expect(response.status).toBe(400);
      expect(errorMessage).toEqual('the userId supplied is not a valid uuid');
      done();
    });

    it('Should allow a user get a list of their habits', async done => {
      await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectTwo);
      const response = await request
        .get(`${baseHabitRoute}/user/${regularUserId}/all-habits`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].name).toEqual(habitBodyObjectOne.name);
      expect(response.body.data[0].startsAt).toEqual(habitBodyObjectOne.startsAt);
      expect(response.body.data[0].expiresAt).toEqual(habitBodyObjectOne.expiresAt);
      done();
    });

    it("Should allow an admin get a list of a user's habits", async done => {
      await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: regularUserOneToken })
        .send(habitBodyObjectTwo);
      const response = await request
        .get(`${baseHabitRoute}/user/${regularUserId}/all-habits`)
        .set({ Authorization: adminToken });
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[1].name).toEqual(habitBodyObjectTwo.name);
      expect(response.body.data[0].startsAt).toEqual(habitBodyObjectOne.startsAt);
      expect(response.body.data[0].expiresAt).toEqual(habitBodyObjectOne.expiresAt);
      done();
    });

    it("Should should restrict access to user's habits for non-admins", async done => {
      await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: superAdminToken })
        .send(habitBodyObjectOne);
      const response = await request
        .get(`${baseHabitRoute}/user/${superAdminId}/all-habits`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(403);
      expect(response.body.error).toHaveProperty('message', 'Not authorized');
      done();
    });
  });

  describe(`GET SINGLE USER HABIT: ${baseHabitRoute}/user/:userId/:habitId`, () => {
    beforeAll(async () => {
      const adminHabitResponse = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: adminToken })
        .send(habitBodyObjectTwo);
      adminHabitId = adminHabitResponse.body.data.id;
    });

    it('Should not permit GET for a non-existent habit', async done => {
      const response = await request
        .get(`${baseHabitRoute}/user/${regularUserId}/${habit404UUID}`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(404);
      expect(response.body.error).toHaveProperty(
        'message',
        `No habit with id ${habit404UUID}`
      );
      done();
    });

    it('Should allow a user get a single habit when required params are provided', async done => {
      const response = await request
        .get(`${baseHabitRoute}/user/${adminId}/${adminHabitId}`)
        .set({ Authorization: adminToken });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual(habitBodyObjectTwo.name);
      done();
    });

    it('Should restrict access to getting a single habit for a user', async done => {
      const response = await request
        .get(`${baseHabitRoute}/user/${adminId}/${adminHabitId}`)
        .set({ Authorization: superAdminToken });
      expect(response.status).toBe(403);
      expect(response.body.error).toHaveProperty('message', 'Not authorized');
      done();
    });
  });

  describe(`EDIT USER HABITS: ${baseHabitRoute}/user/:userId/:habitId`, () => {
    beforeAll(async () => {
      const adminHabitResponse = await request
        .post(`${baseHabitRoute}/create`)
        .set({ Authorization: adminToken })
        .send(habitBodyObjectThree);
      adminHabitId = adminHabitResponse.body.data.id;
    });

    it("Should prevent unfettered access to editing a user's habits", async done => {
      const response = await request
        .patch(`${baseHabitRoute}/user/${adminId}/${adminHabitId}`)
        .set({ Authorization: superAdminToken })
        .send({ name: 'Perform chores' });
      expect(response.status).toBe(403);
      expect(response.body.error).toHaveProperty('message', 'Not authorized');
      done();
    });

    it('Should not allow editing of a non-existent habit', async done => {
      const response = await request
        .patch(`${baseHabitRoute}/user/${adminId}/${habit404UUID}`)
        .set({ Authorization: adminToken })
        .send({ name: 'Perform chores' });
      expect(response.status).toBe(404);
      expect(response.body.error).toHaveProperty(
        'message',
        `No habit with id ${habit404UUID}`
      );
      done();
    });

    it('Should not allow editing when the user has similarly named habit', async done => {
      const response = await request
        .patch(`${baseHabitRoute}/user/${adminId}/${adminHabitId}`)
        .set({ Authorization: adminToken })
        .send({ name: habitBodyObjectThree.name });
      expect(response.status).toBe(409);
      expect(response.body.error).toHaveProperty(
        'message',
        'You already have an habit with that name'
      );
      done();
    });

    it('Should not allow habit update for invalid params', async done => {
      const response = await request
        .patch(`${baseHabitRoute}/user/-3/-4`)
        .set({ Authorization: adminToken })
        .send({ name: 'Marathon training' });
      const errorArray = JSON.parse(response.body.error.message);
      expect(response.status).toBe(400);
      expect(errorArray[0]).toEqual('userId is not a valid uuid');
      expect(errorArray[1]).toEqual('habitId is not a valid uuid');
      done();
    });

    it('Should allow habit update even if name is not supplied', async done => {
      const response = await request
        .patch(`${baseHabitRoute}/user/${adminId}/${adminHabitId}`)
        .set({ Authorization: adminToken })
        .send({});
      expect(response.status).toBe(304);
      done();
    });

    it('Should allow habit name update when name does not already exist', async done => {
      const response = await request
        .patch(`${baseHabitRoute}/user/${adminId}/${adminHabitId}`)
        .set({ Authorization: adminToken })
        .send({ name: 'Stoop to conquer' });
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('name', 'Stoop to conquer');
      done();
    });
  });

  describe(`DELETE USER HABITS: ${baseHabitRoute}/user/:userId/:habitId`, () => {
    it('Should prevent deletion of a habit that does not exist', async done => {
      const response = await request
        .delete(`${baseHabitRoute}/user/${regularUserId}/${habit404UUID}`)
        .set({ Authorization: regularUserOneToken });
      expect(response.status).toBe(404);
      expect(response.body.error).toHaveProperty(
        'message',
        `No habit with id ${habit404UUID}`
      );
      done();
    });

    it('Should allow the successful deletion of an habit for authorized person', async done => {
      const response = await request
        .delete(`${baseHabitRoute}/user/${adminId}/${adminHabitId}`)
        .set({ Authorization: adminToken });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Habit deleted');
      done();
    });
  });
});
