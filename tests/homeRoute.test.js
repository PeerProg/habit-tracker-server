import request from 'supertest';
import app from '../app';

const server = request(app);

describe('Index route', () => {
  it('should return a message upon hitting the home endpoint', (done) => {
    server.get('/')
      .expect(200)
      .expect(/Welcome to the habit tracker application/)
      .end((err, res) => {
        if (err) return err;
        expect(res.status).toEqual(200);
        done();
      });
  });
});
