import supertest from 'supertest';
import app from '../app';
import models from '../models';

const request = supertest.agent(app);

describe('THE HOME ROUTE', () => {
  afterAll(() => models.sequelize.sync({ force: true }));

  describe('Visiting the home Route: /api/v1', () => {
    it('Should successfully access the home endpoint', (done) => {
      request.get('/api/v1')
        .expect(200)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty('message', 'Welcome to the habit tracker application');
          done();
        });
    });
  });
});
