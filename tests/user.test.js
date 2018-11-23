import supertest from 'supertest';
import app from '../app';
import models from '../models';
import { resourceCreator } from '../helpers';

const request = supertest.agent(app);

const firstUser = resourceCreator.createNewUser();
const secondUser = resourceCreator.createNewUser();
const thirdUser = resourceCreator.createNewUser();
const invalidEmailUser = resourceCreator.userWithInvalidEmail();
const invalidPasswordUser = resourceCreator.userWithInvalidPassword();
const noUsernameObject = resourceCreator.withNoUsername();
const noEmailObject = resourceCreator.withNoEmail();

describe.only('THE USER TEST SUITE', () => {
  let createdToken;
  let regularToken;
  beforeAll((done) => {
    models.sequelize.sync({ force: true })
      .then(() => {
        request.post('/user/register')
          .send(firstUser)
          .then(response => {
            createdToken = response.body.token;
            done();
          });
      });
  });

  describe('Creation of a user: /user/register ', () => {
    it('Should create a user when valid payload is provided', (done) => {
      request.post('/user/register')
        .send(secondUser)
        .then(response => {
          expect(response.status).toEqual(201);
          expect(response.body).toHaveProperty('username', secondUser.username);
          expect(response.body).toHaveProperty('email', secondUser.email);
          done();
        });
    });

    it('Should fail creation when username supplied already exists', (done) => {
      request.post('/user/register')
        .send(secondUser)
        .then(response => {
          expect(response.status).toEqual(409);
          expect(response.body).toHaveProperty('message', 'Username already in use');
          done();
        });
    });

    it('Should fail creation when email supplied already exists', (done) => {
      secondUser.username = 'JohnDoe';

      request.post('/user/register')
        .send(secondUser)
        .then(response => {
          expect(response.status).toEqual(409);
          expect(response.body).toHaveProperty('message', 'Email already in use');
          done();
        });
    });

    it('Should fail creation when email address in payload is invalid', (done) => {
      request.post('/user/register')
        .send(invalidEmailUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body).toHaveProperty('message', 'The email address provided is invalid');
          done();
        });
    });

    it('Should fail creation when password fails to match rules', (done) => {
      request.post('/user/register')
        .send(invalidPasswordUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.message).toMatch('The password failed to match');
          done();
        });
    });

    it('should fail creation when no username is supplied', (done) => {
      request.post('/user/register')
        .send(noUsernameObject)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(Array.isArray(response.body.error)).toBeTruthy();
          expect(response.body.error[0]).toEqual('username is required');
          done();
        });
    });

    it('should fail creation when no email is supplied', (done) => {
      request.post('/user/register')
        .send(noEmailObject)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(Array.isArray(response.body.error)).toBeTruthy();
          expect(response.body.error[0]).toEqual('email is required');
          done();
        });
    });

    it('Should fail login for nonexistent user', (done) => {
      const nonExistentUser = {
        identifier: 'JasonBourne',
        password: 'bourne5upremacy'
      };
      request.post('/user/login')
        .send(nonExistentUser)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.message).toEqual('Incorrect Login Information');
          done();
        });
    });

    it('Should fail login when an incorrect password is supplied', (done) => {
      const requestObject = {
        identifier: firstUser.username,
        password: 'wrongPassword'
      };

      request
        .post('/user/login')
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.message).toEqual('Invalid credentials');
          done();
        });
    });

    it('Should permit log in for a user with valid details', (done) => {
      const requestObject = {
        identifier: firstUser.username,
        password: firstUser.password
      };

      request.post('/user/login')
        .send(requestObject)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.message).toEqual('Login Successful! Token expires in one week.');
          done();
        });
    });

    it('Should get the details of a user when valid token is supplied', (done) => {
      request
        .get('/user/1')
        .set({ Authorization: createdToken })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toEqual(firstUser.username);
          done();
        });
    });

    it('Should get the details of all users when valid token is supplied', (done) => {
      request.get('/user/all')
        .set({ Authorization: createdToken })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body[0].username).toEqual(firstUser.username);
          done();
        });
    });

    it('should successfully update user details when valid token is supplied', (done) => {
      const requestObject = { email: 'solomon.grundy@gmail.com' };
      request.put('/user/1')
        .set({ Authorization: createdToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.email).toEqual(requestObject.email);
          expect(response.body).toHaveProperty('message', 'Update successful');
          done();
        });
    });

    it('Should fail to update a user when invalid token is provided', (done) => {
      const requestObject = { email: 'solomon.monday@yahoo.com' };

      request.put('/user/1')
        .set({ Authorization: 'invalid token' })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.message).toBeTruthy();
          expect(response.body.message).toEqual('Invalid token');
          done();
        });
    });

    it('Should fail update when no token is provided', (done) => {
      const requestObject = { email: 'david.paul@skynet.org' };

      request.put('/user/1')
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.message).toBeTruthy();
          expect(response.body.message).toEqual('No token provided');
          done();
        });
    });

    it('Should fail user update for invalid user param', (done) => {
      const requestObject = { email: 'martha.smith@gmail.org' };

      request.put('/user/poly')
        .set({ Authorization: createdToken })
        .send(requestObject)
        .then(response => {
          expect(response.body.error).toEqual('Invalid param. ID should be a number');
          expect(response.status).toEqual(400);
          done();
        });
    });

    it('Should fail to delete user when token is invalid', (done) => {
      request
        .delete('/user/1')
        .set({ Authorization: 'invalid' })
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.message).toEqual('Invalid token');
          done();
        });
    });

    it('Should fail to delete a user that does not exist', (done) => {
      request.delete('/user/546')
        .set({ Authorization: createdToken })
        .then(response => {
          expect(response.status).toEqual(404);
          expect(response.body.message).toEqual('No user with id 546');
          done();
        });
    });

    it('Should fail to delete for non-integer param', (done) => {
      request.delete('/user/nonint')
        .set({ Authorization: createdToken })
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('Invalid param. ID should be a number');
          done();
        });
    });

    it('Should not allow the admin be deleted', (done) => {
      request
        .delete('/user/1')
        .set({ Authorization: createdToken })
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.message).toEqual('Admin cannot be deleted');
          done();
        });
    });

    it('Should not authorize a delete action for a non-admin user', (done) => {
      request
        .post('/user/register')
        .send(thirdUser)
        .then(result => {
          regularToken = result.body.token;
          request
            .delete('/user/2')
            .set({ Authorization: regularToken })
            .then(response => {
              expect(response.status).toEqual(403);
              expect(response.body.message).toEqual('Unauthorized');
              done();
            });
        });
    });

    it('Should successfully delete for valid ID and admin token', (done) => {
      request
        .delete('/user/2')
        .set({ Authorization: createdToken })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.message).toEqual('User Removed');
          done();
        });
    });
  });
});

