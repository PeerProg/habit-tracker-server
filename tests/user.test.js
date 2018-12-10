import supertest from 'supertest';
import app from '../app';
import models from '../models';
import { resourceCreator } from '../helpers';

const request = supertest.agent(app);

const user404UUID = resourceCreator.user404UUID();
const superAdmin = resourceCreator.createSuperAdmin();
const adminUser = resourceCreator.createAdminUser();
const firstRegularUser = resourceCreator.createRegularUser();
const secondRegularUser = resourceCreator.createRandomUser();
const thirdRegularUser = resourceCreator.createNormalUser();
const invalidEmailUser = resourceCreator.userWithInvalidEmail();
const invalidUsernameUser = resourceCreator.userWithInvalidUsername();
const onlyNumsUsernameUser = resourceCreator.userWithOnlyNumsForUsername();
const oneCharUsername = resourceCreator.userWithOneCharUsername();
const invalidPasswordUser = resourceCreator.userWithInvalidPassword();
const noUsernameUser = resourceCreator.withNoUsername();
const noEmailUser = resourceCreator.withNoEmail();
const emptyFieldsUser = resourceCreator.emptyFieldsUser();
const invalidImageURL = resourceCreator.userWithInvalidImageURL();
const emptyImageURL = resourceCreator.userWithNoImageURL();

const signupRoute = '/api/v1/user/register';
const loginRoute = '/api/v1/user/login';
const singleRequestRoute = '/api/v1/user';
const allUsersRoute = '/api/v1/user/all';
const deactivateSubRoute = '/api/v1/user/deactivate';
const activateSubRoute = '/api/v1/user/activate';

describe('THE USER TEST SUITE', () => {
  let superAdminToken;
  let adminToken;
  let adminID;
  let regularToken;
  let thirdUserToken;
  let superAdminId;
  let thirdUserId;

  beforeAll(done => {
    request
      .post(signupRoute)
      .send(superAdmin)
      .then(response => {
        superAdminToken = response.body.data.token;
        superAdminId = response.body.data.id;
        request
          .post(signupRoute)
          .send(adminUser)
          .then(res => {
            adminToken = res.body.data.token;
            adminID = res.body.data.id;
            request
              .post(signupRoute)
              .send(thirdRegularUser)
              .then(result => {
                thirdUserToken = result.body.data.token;
                thirdUserId = result.body.data.id;
                done();
              });
          });
      });
  });

  afterAll(() => models.sequelize.sync({ force: true }));

  describe(`CREATE USER: ${signupRoute}`, () => {
    it('Should create a user when valid payload is provided', done => {
      request
        .post(signupRoute)
        .send(firstRegularUser)
        .then(response => {
          expect(response.status).toEqual(201);
          expect(response.body.data).toHaveProperty(
            'username',
            firstRegularUser.username
          );
          expect(response.body.data).toHaveProperty(
            'email',
            firstRegularUser.email
          );
          expect(response.body.data).toHaveProperty(
            'imageURL',
            firstRegularUser.imageURL
          );
          expect(response.body.data).toHaveProperty('isActive', true);
          done();
        });
    });

    it('Should fail creation when the username supplied already exists', done => {
      const requestObject = {
        username: firstRegularUser.username,
        email: 'unused@yahoo.co.uk',
        password: 'unusedpassword',
        imageURL: 'imageURL/goes/here.png'
      };

      request
        .post(signupRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(409);
          expect(response.body.error).toHaveProperty(
            'message',
            'Username already in use'
          );
          done();
        });
    });

    it('Should fail creation when email supplied already exists', done => {
      const requestObject = {
        username: 'flamingo',
        email: firstRegularUser.email,
        password: 'unusedpassword',
        imageURL: 'imageURL/goes/here.png'
      };

      request
        .post(signupRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(409);
          expect(response.body.error).toHaveProperty(
            'message',
            'Email already in use'
          );
          done();
        });
    });

    it('Should fail creation when email address in payload is invalid', done => {
      request
        .post(signupRoute)
        .send(invalidEmailUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toHaveProperty(
            'message',
            'The email address provided is invalid'
          );
          done();
        });
    });

    it('Should fail creation when username does not match rules', done => {
      request
        .post(signupRoute)
        .send(invalidUsernameUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error.message).toMatch('Username is invalid');
          done();
        });
    });

    it('Should fail creation when username is numbers only', done => {
      request
        .post(signupRoute)
        .send(onlyNumsUsernameUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error.message).toMatch('A two-character username must have only letters');
          done();
        });
    });

    it('Should fail creation when username is one character only', done => {
      request
        .post(signupRoute)
        .send(oneCharUsername)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error.message).toMatch('Username must be at least two characters');
          done();
        });
    });

    it('Should not allow a user be created with empty fields', done => {
      request
        .post(signupRoute)
        .send(emptyFieldsUser)
        .then(response => {
          const errorArray = JSON.parse(response.body.error.message);
          expect(response.status).toEqual(400);
          expect(errorArray.length).toBe(2);
          expect(errorArray[0]).toEqual('username cannot be empty');
          expect(errorArray[1]).toEqual('email cannot be empty');
          done();
        });
    });

    it('Should fail creation when password fails to match rules', done => {
      request
        .post(signupRoute)
        .send(invalidPasswordUser)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error.message).toMatch('The password failed to match');
          done();
        });
    });

    it('Should fail creation when no username is supplied', done => {
      request
        .post(signupRoute)
        .send(noUsernameUser)
        .then(response => {
          const errorArray = JSON.parse(response.body.error.message);
          expect(response.status).toEqual(400);
          expect(errorArray[0]).toEqual('username is required');
          done();
        });
    });

    it('Should fail creation when no email is supplied', done => {
      request
        .post(signupRoute)
        .send(noEmailUser)
        .then(response => {
          const errorArray = JSON.parse(response.body.error.message);
          expect(response.status).toEqual(400);
          expect(errorArray[0]).toEqual('email is required');
          done();
        });
    });

    it('should fail creation when no required field is supplied', done => {
      request
        .post(signupRoute)
        .send({})
        .then(response => {
          const errorArray = JSON.parse(response.body.error.message);
          expect(response.status).toEqual(400);
          expect(errorArray[0]).toEqual('username is required');
          expect(errorArray[1]).toEqual('email is required');
          expect(errorArray[2]).toEqual('password is required');
          done();
        });
    });

    it('Should create user when imageURL payload is empty', done => {
      request
        .post(signupRoute)
        .send(emptyImageURL)
        .then(response => {
          expect(response.status).toEqual(201);
          expect(response.body.data).toHaveProperty('imageURL', null);
          done();
        });
    });

    it('Should fail creation when imageURL payload is invalid', done => {
      request
        .post(signupRoute)
        .send(invalidImageURL)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toHaveProperty(
            'message',
            'Invalid imageURL'
          );
          done();
        });
    });
  });

  describe(`DEACTIVATE USER ${deactivateSubRoute}/:id`, () => {
    it('Should not deactivate user if isActive status does not change', done => {
      request
        .patch(`${deactivateSubRoute}/${thirdUserId}`)
        .set({ Authorization: thirdUserToken })
        .send({ isActive: true })
        .then(response => {
          expect(response.body).toHaveProperty(
            'message',
            'Account still active. Try again.'
          );
          done();
        });
    });

    it('Should allow the successful deactivation of a user', done => {
      request
        .patch(`${deactivateSubRoute}/${thirdUserId}`)
        .set({ Authorization: thirdUserToken })
        .send({ isActive: false })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty(
            'message',
            'Account deactivated'
          );
          done();
        });
    });
  });

  describe(`LOGIN: ${loginRoute}`, () => {
    it('Should fail login for nonexistent user', done => {
      const nonExistentUser = {
        identifier: 'jasonbourne',
        password: 'bourne5upremacy'
      };
      request
        .post(loginRoute)
        .send(nonExistentUser)
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.error.message).toEqual('Incorrect Login Information');
          done();
        });
    });

    it('Should fail login when an incorrect password is supplied', done => {
      const requestObject = {
        identifier: firstRegularUser.username,
        password: 'wrongPassword'
      };

      request
        .post(loginRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.error.message).toEqual('Invalid credentials');
          done();
        });
    });

    it('Should permit log in for a user with valid details', done => {
      const requestObject = {
        identifier: firstRegularUser.username,
        password: firstRegularUser.password
      };

      request
        .post(loginRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.message).toEqual('Login Successful! Token expires in one week.');
          done();
        });
    });

    it('Should permit log in even if the identifier case is not the same that in the DB', done => {
      const requestObject = {
        identifier: firstRegularUser.username.toUpperCase(),
        password: firstRegularUser.password
      };

      request
        .post(loginRoute)
        .send(requestObject)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.message).toEqual('Login Successful! Token expires in one week.');
          done();
        });
    });

    it('Should redirect a deactivated user to the activate route', done => {
      const requestObject = {
        identifier: thirdRegularUser.username,
        password: thirdRegularUser.password
      };
      request
        .post(loginRoute)
        .send(requestObject)
        .then(response => {
          expect(response.headers.location).toEqual(`/activate/${thirdUserId}`);
          done();
        });
    });
  });

  describe(`GET USER: ${singleRequestRoute}/:id`, () => {
    it('Should get the details of a user when valid token is supplied', done => {
      request
        .get(`${singleRequestRoute}/${superAdminId}`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.data.username).toEqual(superAdmin.username);
          expect(response.body.data).toHaveProperty('isSuperAdmin', true);
          done();
        });
    });

    it('Should not get a user that does not exist', done => {
      request
        .get(`${singleRequestRoute}/${user404UUID}`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(404);
          expect(response.body.error.message).toEqual(`No user with id ${user404UUID}`);
          done();
        });
    });

    it('Should not get a user when param is invalid', done => {
      request
        .get(`${singleRequestRoute}/getTheUser`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toHaveProperty(
            'message',
            'Invalid uuid user id param'
          );
          done();
        });
    });
  });

  describe(`GET ALL USERS: ${allUsersRoute}`, () => {
    it('Should get the details of all users when valid token is supplied', done => {
      request
        .get(allUsersRoute)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.data[0]).toHaveProperty(
            'username',
            superAdmin.username
          );
          done();
        });
    });
  });

  describe(`UPDATE USER: ${singleRequestRoute}/:id`, () => {
    it('Should fail to update a user when invalid token is provided', done => {
      const requestObject = { email: 'solomon.monday@yahoo.com' };

      request
        .patch(`${singleRequestRoute}/${adminID}`)
        .set({ Authorization: 'invalid token' })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.error.message).toEqual('Invalid token');
          done();
        });
    });

    it('Should fail update when no token is provided', done => {
      const requestObject = { email: 'david.paul@skynet.org' };

      request
        .patch(`${singleRequestRoute}/${adminID}`)
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error.message).toEqual('No token provided');
          done();
        });
    });

    it('Should fail user update for invalid url param', done => {
      const requestObject = { email: 'martha.smith@gmail.org' };

      request
        .patch(`${singleRequestRoute}/poly`)
        .set({ Authorization: superAdminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error.message).toEqual('Invalid uuid user id param');
          done();
        });
    });

    it("Should not allow update of another user's details", done => {
      const requestObject = { email: 'adenike_lily@gmail.com' };

      request
        .patch(`${singleRequestRoute}/${adminID}`)
        .set({ Authorization: superAdminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.error.message).toMatch('Operation not permitted on another user');
          done();
        });
    });

    it('Should not allow update of a nonexistent user', done => {
      const requestObject = { email: 'solomon.grundy@gmail.com' };
      request
        .patch(`${singleRequestRoute}/${user404UUID}`)
        .set({ Authorization: superAdminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(404);
          expect(response.body.error).toHaveProperty(
            'message',
            `No user with id ${user404UUID}`
          );
          done();
        });
    });

    it('Should not allow an inactive user make an update', done => {
      const requestObject = { email: 'inactiveuser@gmail.com' };
      request
        .patch(`${singleRequestRoute}/${thirdUserId}`)
        .set({ Authorization: thirdUserToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body.error.message).toMatch('Activate to perform operation');
          done();
        });
    });

    it('Should successfully update email when valid token is supplied', done => {
      const requestObject = { email: 'solomon.grundy@gmail.com' };
      request
        .patch(`${singleRequestRoute}/${adminID}`)
        .set({ Authorization: adminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.data).toHaveProperty(
            'email',
            requestObject.email
          );
          expect(response.body).toHaveProperty('message', 'Update successful');
          done();
        });
    });

    it('Should successfully update username when valid token is supplied', done => {
      const requestObject = { username: 'bodunde' };
      request
        .patch(`${singleRequestRoute}/${adminID}`)
        .set({ Authorization: adminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.data).toHaveProperty(
            'username',
            requestObject.username
          );
          expect(response.body).toHaveProperty('message', 'Update successful');
          done();
        });
    });

    it('Should successfully update imageURL when valid token is supplied', done => {
      const requestObject = { imageURL: 'https://imageURL/goes/test.jpg' };
      request
        .patch(`${singleRequestRoute}/${adminID}`)
        .set({ Authorization: adminToken })
        .send(requestObject)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.data).toHaveProperty(
            'imageURL',
            requestObject.imageURL
          );
          expect(response.body).toHaveProperty('message', 'Update successful');
          done();
        });
    });
  });

  describe(`ACTIVATE USER ${activateSubRoute}/:id`, () => {
    it('Should not reactivate user if the active status does not change', done => {
      request
        .patch(`${activateSubRoute}/${thirdUserId}`)
        .send({ isActive: false })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty(
            'message',
            'Account still inactive. Try again.'
          );
          done();
        });
    });

    it('Should successfuly activate a deactivated user', done => {
      request
        .patch(`${activateSubRoute}/${thirdUserId}`)
        .send({ isActive: true })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty(
            'message',
            'Account reactivated'
          );
          done();
        });
    });
  });

  describe(`DELETE USER: ${singleRequestRoute}/:id`, () => {
    it('Should fail to delete user when token is invalid', done => {
      request
        .delete(`${singleRequestRoute}/${thirdUserId}`)
        .set({ Authorization: 'invalidToken' })
        .then(response => {
          expect(response.status).toEqual(401);
          expect(response.body.error.message).toEqual('Invalid token');
          done();
        });
    });

    it('Should fail to delete a user that does not exist', done => {
      request
        .delete(`${singleRequestRoute}/${user404UUID}`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(404);
          expect(response.body.error.message).toEqual(`No user with id ${user404UUID}`);
          done();
        });
    });

    it('Should fail to delete for invalid userId param', done => {
      request
        .delete(`${singleRequestRoute}/nonint`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(400);
          expect(response.body.error.message).toEqual('Invalid uuid user id param');
          done();
        });
    });

    it('Should not allow the admin be deleted', done => {
      request
        .delete(`${singleRequestRoute}/${adminID}`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(403);
          expect(response.body).toHaveProperty(
            'message',
            'Admin cannot be deleted'
          );
          done();
        });
    });

    it('Should not authorize a delete action for a non-admin user', done => {
      request
        .post(signupRoute)
        .send(secondRegularUser)
        .then(result => {
          regularToken = result.body.data.token;
          request
            .delete(`${singleRequestRoute}/${thirdUserId}`)
            .set({ Authorization: regularToken })
            .then(response => {
              expect(response.status).toEqual(403);
              expect(response.body.error.message).toEqual('Unauthorized');
              done();
            });
        });
    });

    it('Should successfully delete for valid ID and admin token', done => {
      request
        .delete(`${singleRequestRoute}/${thirdUserId}`)
        .set({ Authorization: superAdminToken })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.message).toEqual('User Removed');
          request.delete('/api/v1/user/logout').then(() => {
            done();
          });
        });
    });
  });
});
