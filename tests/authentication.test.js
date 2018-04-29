import request from 'supertest';
import app from '../app';
import models from '../server/models';

const server = request.agent(app);

describe('Authentication Test Suite', () => {
  let createdToken;
  beforeAll((done) => {
    models.sequelize.sync({ force: true })
      .then(() => {
        const newUserBody = {
          username: 'newuser',
          email: 'newuser@user.com',
          password: 'administrator'
        };

        server.post('/user/register')
          .send(newUserBody)
          .end((err, res) => {
            if (err) return err;
            createdToken = res.body.token;
            done();
          });
      }).catch(err => err);
  });

  it('It should not authenticate a user with no token', (done) => {
    server.get('/user/allusers')
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });

  it('should not authenticate a user with an invalid token', (done) => {
    server.get('/user/allusers')
      .set({ Authorization: 'trinity' })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });

  it('should authenticate a user when valid token is supplied', (done) => {
    server.get('/user/allusers')
      .set({ Authorization: createdToken })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.totalNumberOfUsers).toEqual(1);
        done();
      });
  });
});
