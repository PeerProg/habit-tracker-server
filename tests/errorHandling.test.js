import supertest from 'supertest';
import app from '../app';

const request = supertest.agent(app);

describe('ERROR HANDLING', () => {
  describe('404 error handling', () => {
    it('Should send an error message when a route that does not exist is visited', (done) => {
      request.get('/made-up-route')
        .send({ data: 'Send response' })
        .then(response => {
          expect(response.body.error).toHaveProperty('message', 'Not Found');
          expect(response.status).toBe(404);
          done();
        });
    });
  })

});
