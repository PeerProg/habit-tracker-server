import request from 'supertest';
import app from '../app';

const server = request.agent(app);

describe('Index route', () => {
  it('should return a message upon hitting the home endpoint', (done) => {
    server.get('/')
      .expect(200)
      .end((error, response) => {
        const { message } = response.body;
        expect(message).toEqual('Welcome to the habit tracker application');
      });
    done();
  });
});
