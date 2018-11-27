import supertest from 'supertest';
import app from '../app';
import models from '../models';

const request = supertest.agent(app);

describe('ERROR HANDLING', () => {
  afterAll(() => models.sequelize.sync({ force: true }));

  describe('404 error handling', () => {
    it('Should send an error message when a route that does not exist is visited', (done) => {
      request.get('/made-up-route')
        .then(response => {
          expect(response.body.error).toHaveProperty('message', 'Route not Found');
          expect(response.status).toBe(404);
          done();
        });
    });
  });
});
