import supertest from 'supertest';
import app from '../app';
import models from '../models';
import { resourceCreator } from '../helpers';

const request = supertest.agent(app);

const habit404UUID = resourceCreator.habit404UUID();
const milestone404UUID = resourceCreator.milestone404UUID();
const regularUserObject = resourceCreator.createRegularUser();
const newHabitObject = resourceCreator.createNewHabit();

const baseUserRoute = '/api/v1/user';
const baseHabitRoute = '/api/v1/habit';
const baseMilestoneRoute = '/api/v1/milestone';

describe('THE MILESTONE TEST SUITE', () => {
  let regularUserToken;
  let habitId;
  let milestoneId;

  beforeAll(async () => {
    const result = await request.post(`${baseUserRoute}/register`).send(regularUserObject);
    regularUserToken = result.body.data.token;
    const habitCreationResp = await request.post(`${baseHabitRoute}/create`)
      .set({ Authorization: regularUserToken })
      .send(newHabitObject);
    habitId = habitCreationResp.body.data.id;
  });

  afterAll(() => models.sequelize.sync({ force: true }));

  describe('CREATE MILESTONE', () => {
    beforeAll(async () => {
      const milestoneResponse = await request.post(`${baseMilestoneRoute}/${habitId}/add`)
        .set({ Authorization: regularUserToken })
        .send({ title: 'Observe Daily siesta' });
      milestoneId = milestoneResponse.body.id;
    });

    it('Should not create a milestone if habit does not exist', async (done) => {
      const milestoneResponse = await request.post(`${baseMilestoneRoute}/${habit404UUID}/add`)
        .set({ Authorization: regularUserToken })
        .send({});
      expect(milestoneResponse.status).toBe(404);
      expect(milestoneResponse.body.error).toHaveProperty('message', `No habit with id ${habit404UUID}`);
      done();
    });

    it('Should not create a milestone if title is not supplied', async (done) => {
      const milestoneResponse = await request.post(`${baseMilestoneRoute}/${habitId}/add`)
        .set({ Authorization: regularUserToken })
        .send({});
      expect(milestoneResponse.body).toHaveProperty('error', 'title is required');
      done();
    });

    it('Should not create a milestone if title is empty', async (done) => {
      const milestoneResponse = await request.post(`${baseMilestoneRoute}/${habitId}/add`)
        .set({ Authorization: regularUserToken })
        .send({ title: '' });
      expect(milestoneResponse.body).toHaveProperty('error', 'title cannot be empty');
      done();
    });

    it('Should successfully create a milestone when request body is valid', async (done) => {
      const milestoneResponse = await request.post(`${baseMilestoneRoute}/${habitId}/add`)
        .set({ Authorization: regularUserToken })
        .send({ title: 'workout in the Gym' });
      milestoneId = milestoneResponse.body.id;
      expect(milestoneResponse.status).toBe(200);
      expect(milestoneResponse.body).toHaveProperty('title', 'Workout in the gym');
      done();
    });

    it('Should not create a milestone when habit has similarly named milestone', async (done) => {
      const milestoneResponse = await request.post(`${baseMilestoneRoute}/${habitId}/add`)
        .set({ Authorization: regularUserToken })
        .send({ title: 'workout in the Gym' });
      expect(milestoneResponse.body.message).toMatch('milestone with the same title');
      done();
    });
  });

  describe(`GET AN HABIT'S MILESTONES: ${baseMilestoneRoute}/:habitId/milestones`, () => {
    it('Should get all milestones associated with an habit', async (done) => {
      const responseObject = await request.get(`${baseMilestoneRoute}/${habitId}/milestones`)
        .set({ Authorization: regularUserToken })
        .send();
      expect(Array.isArray(responseObject.body)).toBe(true);
      expect(responseObject.body.length).toBe(2);
      expect(responseObject.body[1].title).toEqual('Workout in the gym');
      done();
    });
  });

  describe(`GET ONE MILESTONE: ${baseMilestoneRoute}/:habitId/get/:milestoneId`, () => {
    it('Should successfully get one milestone with proper params supplied', async (done) => {
      const milestoneResponse = await request.get(`${baseMilestoneRoute}/${habitId}/get/${milestoneId}`)
        .set({ Authorization: regularUserToken })
        .send();
      expect(milestoneResponse.body.title).toEqual('Workout in the gym');
      done();
    });

    it('Should return a failure message if milestone does not exist', async (done) => {
      const milestoneResponse = await request.get(`${baseMilestoneRoute}/${habitId}/get/${milestone404UUID}`)
        .set({ Authorization: regularUserToken })
        .send();
      expect(milestoneResponse.body.message).toEqual(`No milestone with id ${milestone404UUID}`);
      done();
    });
  });

  describe(`UPDATE MILESTONE: ${baseMilestoneRoute}/:habitId/edit/:milestoneId`, () => {
    it('Should fail for a similarly named title under the same habit', async (done) => {
      await request.post(`${baseMilestoneRoute}/${habitId}/add`)
        .set({ Authorization: regularUserToken })
        .send({ title: 'Write Blogposts' });
      const updateResponse = await request.put(`${baseMilestoneRoute}/${habitId}/edit/${milestoneId}`)
        .set({ Authorization: regularUserToken })
        .send({ title: 'Write Blogposts' });
      expect(updateResponse.body.message).toMatch('milestone with the same title');
      done();
    });

    it('Should successfully update when an allowed request is made', async (done) => {
      const updateResponse = await request.put(`${baseMilestoneRoute}/${habitId}/edit/${milestoneId}`)
        .set({ Authorization: regularUserToken })
        .send({ title: 'Start a fitness PLAN' });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toEqual('Start a fitness plan');
      done();
    });

    it('Should be successful even if nothing changes', async (done) => {
      const updateResponse = await request.put(`${baseMilestoneRoute}/${habitId}/edit/${milestoneId}`)
        .set({ Authorization: regularUserToken })
        .send({});
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toEqual('Start a fitness plan');
      done();
    });
  });

  describe(`DELETE MILESTONE: ${baseMilestoneRoute}/:habitId/delete/:milestoneId`, () => {
    it('Should fail for non-existent habit', async (done) => {
      const deleteResponse = await request.delete(`${baseMilestoneRoute}/${habit404UUID}/delete/${milestoneId}`)
        .set({ Authorization: regularUserToken })
        .send();
      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body.error.message).toEqual(`No habit with id ${habit404UUID}`);
      done();
    });

    it('Should successfully delete a valid milestone', async (done) => {
      const deleteResponse = await request.delete(`${baseMilestoneRoute}/${habitId}/delete/${milestoneId}`)
        .set({ Authorization: regularUserToken })
        .send();
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toEqual('Milestone deleted');
      done();
    });
  });
});
