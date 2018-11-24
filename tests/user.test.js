import supertest from 'supertest';
import app from '../app';
import models from '../models';
import { resourceCreator } from '../helpers';

const request = supertest.agent(app);

const superAdmin = resourceCreator.createSuperAdmin();
const adminUser = resourceCreator.createAdminUser();
const firstRegularUser = resourceCreator.createRegularUser();
const secondRegularUser = resourceCreator.createRegularUser();
const thirdRegularUser = resourceCreator.createRegularUser();
const invalidEmailUser = resourceCreator.userWithInvalidEmail();
const invalidPasswordUser = resourceCreator.userWithInvalidPassword();
const noUsernameUser = resourceCreator.withNoUsername();
const noEmailUser = resourceCreator.withNoEmail();
const emptyFieldsUser = resourceCreator.emptyFieldsUser();

const signupRoute = '/api/v1/user/register';
const loginRoute = '/api/v1/user/login';
const singleRequestRoute = '/api/v1/user';
const allUsersRoute = '/api/v1/user/all';
const deactivateSubRoute = '/api/v1/user/deactivate';
const activateSubRoute = '/api/v1/user/activate';

describe('THE USER TEST SUITE', () => {
  let superAdminToken;
  let adminToken;
  let regularToken;
  let thirdUserToken;
  beforeAll((done) => {
    models.sequelize.sync({ force: true })
      .then(() => {
        request.post(signupRoute)
          .send(superAdmin)
          .then(response => {
            superAdminToken = response.body.token;
            request.post(signupRoute)
              .send(adminUser)
              .then(res => {
                adminToken = res.body.token;
                request.post(signupRoute)
                  .send(thirdRegularUser)
                  .then(result => {
                    thirdUserToken = result.body.token;
                    done();
                  });
              });
          });
      });
  });

  // afterAll(() => models.sequelize.sync({ force: true }));

  describe(`CREATE USER: ${signupRoute}`, () => {
    it('Should create a user when valid payload is provided', (done) => {
      request.post(signupRoute)
        .send(firstRegularUser)
        .then(response => {
          expect(response.status).toEqual(201);
          expect(response.body).toHaveProperty('username', firstRegularUser.username);
          expect(response.body).toHaveProperty('email', firstRegularUser.email);
          expect(response.body).toHaveProperty('isActive', true);
          done();
        });
    });

    it('Should fail creation when the username supplied already exists', (done) => {
      const requestObject = {
        username: firstRegularUser.username,
        email: 'unused@yahoo.co.uk',
        password: 'unusedpassword',
      };

      request.post(signupRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(409);
          expect(response.body).toHaveProperty('message', 'Username already in use');
          done();
        });
    });

    it('Should fail creation when email supplied already exists', (done) => {
      const requestObject = {
        username: 'flamingo',
        email: firstRegularUser.email,
        password: 'unusedpassword',
      };

      request.post(signupRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(409);
          expect(response.body).toHaveProperty('message', 'Email already in use');
          done();
        });
    });

    it('Should fail creation when email address in payload is invalid', (done) => {
      request.post(signupRoute)
        .send(invalidEmailUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body).toHaveProperty('message', 'The email address provided is invalid');
          done();
        });
    });

    it('Should not allow a user be created with empty fields', (done) => {
      request
        .post(signupRoute)
        .send(emptyFieldsUser)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body).toHaveProperty('error');
          expect(Array.isArray(response.body.error)).toBeTruthy();
          expect(response.body.error.length).toBe(2);
          expect(response.body.error[0]).toEqual('username cannot be empty');
          expect(response.body.error[1]).toEqual('email cannot be empty');
          done();
        });
    });

    it('Should fail creation when password fails to match rules', (done) => {
      request.post(signupRoute)
        .send(invalidPasswordUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.message).toMatch('The password failed to match');
          done();
        });
    });

    it('should fail creation when no username is supplied', (done) => {
      request.post(signupRoute)
        .send(noUsernameUser)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(Array.isArray(response.body.error)).toBeTruthy();
          expect(response.body.error[0]).toEqual('username is required');
          done();
        });
    });

    it('should fail creation when no email is supplied', (done) => {
      request.post(signupRoute)
        .send(noEmailUser)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(Array.isArray(response.body.error)).toBeTruthy();
          expect(response.body.error[0]).toEqual('email is required');
          done();
        });
    });
  });

  describe(`DEACTIVATE USER ${deactivateSubRoute}/:id`, () => {
    it('Should not deactivate user if isActive status does not change', (done) => {
      request
        .put(`${deactivateSubRoute}/3`)
        .set({ Authorization: thirdUserToken })
        .send({ isActive: true })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty('message', 'Account still active. Try again.');
          done();
        });
    });

    it('Allows the successful deactivation of a user', (done) => {
      request
        .put(`${deactivateSubRoute}/3`)
        .set({ Authorization: thirdUserToken })
        .send({ isActive: false })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty('message', 'Account deactivated');
          expect(response.body).toHaveProperty('isActive', false);
          done();
        });
    });
  });

  describe(`LOGIN: ${loginRoute}`, () => {
    it('Should fail login for nonexistent user', (done) => {
      const nonExistentUser = {
        identifier: 'jasonbourne',
        password: 'bourne5upremacy'
      };
      request
        .post(loginRoute)
        .send(nonExistentUser)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.message).toEqual('Incorrect Login Information');
          done();
        });
    });

    it('Should fail login when an incorrect password is supplied', (done) => {
      const requestObject = {
        identifier: firstRegularUser.username,
        password: 'wrongPassword'
      };

      request
        .post(loginRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.message).toEqual('Invalid credentials');
          done();
        });
    });

    it('Should permit log in for a user with valid details', (done) => {
      const requestObject = {
        identifier: firstRegularUser.username,
        password: firstRegularUser.password
      };

      request.post(loginRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.message).toEqual('Login Successful! Token expires in one week.');
          done();
        });
    });

    it('Should redirect a deactivated user to the activate route', (done) => {
      const requestObject = {
        identifier: thirdRegularUser.username,
        password: thirdRegularUser.password
      };
      request
        .post(loginRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(302);
          expect(response.headers.location).toEqual('/activate/3');
          done();
        });
    });
  });

  describe(`GET USER: ${singleRequestRoute}/:id`, () => {
    it('Should get the details of a user when valid token is supplied', (done) => {
      request
        .get(`${singleRequestRoute}/1`)
        .set({ Authorization: superAdminToken })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toEqual(superAdmin.username);
          expect(response.body).toHaveProperty('isSuperAdmin', true);
          done();
        });
    });

    it('Should not get a user that does not exist', (done) => {
      request
        .get(`${singleRequestRoute}/546`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(404);
          expect(response.body.message).toEqual('No user with id 546');
          done();
        });
    });

    it('Should not get a user when param is invalid', (done) => {
      request
        .get(`${singleRequestRoute}/getTheUser`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body).toHaveProperty('error', 'Invalid param. ID should be a number');
          done();
        });
    });
  });

  describe(`GET ALL USERS: ${allUsersRoute}`, () => {
    it('Should get the details of all users when valid token is supplied', (done) => {
      request.get(allUsersRoute)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body[0]).toHaveProperty('username', superAdmin.username);
          done();
        });
    });
  });

  describe(`UPDATE USER: ${singleRequestRoute}/:id`, () => {
    it('Should fail to update a user when invalid token is provided', (done) => {
      const requestObject = { email: 'solomon.monday@yahoo.com' };

      request
        .put(`${singleRequestRoute}/4`)
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

      request.put(`${singleRequestRoute}/1`)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.message).toBeTruthy();
          expect(response.body.message).toEqual('No token provided');
          done();
        });
    });

    it('Should fail user update for invalid url param', (done) => {
      const requestObject = { email: 'martha.smith@gmail.org' };

      request.put(`${singleRequestRoute}/poly`)
        .set({ Authorization: superAdminToken })
        .send(requestObject)
        .then(response => {
          expect(response.body.error).toEqual('Invalid param. ID should be a number');
          expect(response.status).toEqual(400);
          done();
        });
    });

    it('Should not allow update of another user\'s details', (done) => {
      const requestObject = { email: 'adenike_lily@gmail.com' };

      request.put(`${singleRequestRoute}/2`)
        .set({ Authorization: superAdminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.message).toMatch('Operation not permitted on another user');
          done();
        });
    });

    it('Should not allow update of a nonexistent user', (done) => {
      const requestObject = { email: 'solomon.grundy@gmail.com' };
      request.put(`${singleRequestRoute}/187`)
        .set({ Authorization: superAdminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(404);
          expect(response.body).toHaveProperty('message', 'No user with id 187');
          done();
        });
    });

    it('Should not allow an inactive user make an update', (done) => {
      const requestObject = { email: 'inactiveuser@gmail.com' };
      request.put(`${singleRequestRoute}/3`)
        .set({ Authorization: thirdUserToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.message).toMatch('Activate to perform operation');
          done();
        });
    });

    it('Should successfully update user details when valid token is supplied', (done) => {
      const requestObject = { email: 'solomon.grundy@gmail.com' };
      request.put(`${singleRequestRoute}/2`)
        .set({ Authorization: adminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty('email', requestObject.email);
          expect(response.body).toHaveProperty('message', 'Update successful');
          done();
        });
    });
  });

  describe(`ACTIVATE USER ${activateSubRoute}/:id`, () => {
    it('Should not reactivate user if the active status does not change', (done) => {
      request
        .put(`${activateSubRoute}/3`)
        .send({ isActive: false })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty('message', 'Account still inactive. Try again.');
          done();
        });
    });

    it('Should successfuly activate a deactivated user', (done) => {
      request
        .put(`${activateSubRoute}/3`)
        .send({ isActive: true })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty('message', 'Account reactivated');
          done();
        });
    });
  });

  describe(`DELETE USER: ${singleRequestRoute}/:id`, () => {
    it('Should fail to delete user when token is invalid', (done) => {
      request
        .delete(`${singleRequestRoute}/4`)
        .set({ Authorization: 'invalidToken' })
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.message).toEqual('Invalid token');
          done();
        });
    });

    it('Should fail to delete a user that does not exist', (done) => {
      request.delete(`${singleRequestRoute}/546`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(404);
          expect(response.body.message).toEqual('No user with id 546');
          done();
        });
    });

    it('Should fail to delete for non-integer param', (done) => {
      request.delete(`${singleRequestRoute}/nonint`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('Invalid param. ID should be a number');
          done();
        });
    });

    it('Should not allow the admin be deleted', (done) => {
      request
        .delete(`${singleRequestRoute}/2`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body).toHaveProperty('message', 'Admin cannot be deleted');
          done();
        });
    });

    it('Should not authorize a delete action for a non-admin user', (done) => {
      request
        .post(signupRoute)
        .send(secondRegularUser)
        .then(result => {
          regularToken = result.body.token;
          request
            .delete(`${singleRequestRoute}/2`)
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
        .delete(`${singleRequestRoute}/4`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.message).toEqual('User Removed');
          done();
        });
    });
  });
});

