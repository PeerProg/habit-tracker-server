import supertest from 'supertest';
import app from '../app';

const request = supertest.agent(app);

describe('THE HOME ROUTE', () => {
  it('Should successfully access the home endpoint', (done) => {
    request.get('/')
      .expect(200)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Welcome to the habit tracker application');
        done();
      });
  });
});
