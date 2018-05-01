import request from 'supertest';
import app from '../app';
import models from '../server/models';

const server = request.agent(app);

describe('THE USER TEST SUITE', () => {
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

  describe('Creation of a user', () => {
    it('should successfully create a user with valid details', (done) => {
      const userData = {
        username: 'oreoluwa',
        email: 'oreoluwa@oreoluwa.com',
        password: 'oreoluwa'
      };
      server.post('/user/register')
        .send(userData)
        .expect(201)
        .expect(/User creation Successful!/)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(201);
          done();
        });
    });

    it('should fail creation for an already existing username', (done) => {
      const userData = {
        username: 'oreoluwa',
        email: 'oreoluwa@new.com',
        password: 'oreoluwa'
      };
      server.post('/user/register')
        .send(userData)
        .expect(409)
        .expect(/Username already in use/)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(409);
          done();
        });
    });

    it('should fail creation for an already existing email', (done) => {
      const userData = {
        username: 'oreoluwade',
        email: 'oreoluwa@oreoluwa.com',
        password: 'oreoluwa'
      };
      server.post('/user/register')
        .send(userData)
        .expect(409)
        .expect(/Email already in use/)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(409);
          done();
        });
    });

    it('should fail creation given an invalid email address', (done) => {
      const userData = {
        username: 'pelumi',
        email: 'gargantuan',
        password: 'oluwapelumi'
      };
      server.post('/user/register')
        .send(userData)
        .expect(400)
        .expect(/You must provide a valid email address/)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(400);
          done();
        });
    });

    it('should fail creation when password fails to match rules', (done) => {
      const userData = {
        username: 'oluwaseyi',
        email: 'seyi@hbtracker.com',
        password: 'olu'
      };
      server.post('/user/register')
        .send(userData)
        .expect(400)
        .expect(/The password failed to match/)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(400);
          done();
        });
    });

    it('should fail creation when no username is supplied', (done) => {
      const userData = {
        username: '',
        email: 'yeye@yeye.com',
        password: ''
      };
      server.post('/user/register')
        .send(userData)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(400);
          expect(res.body.error).toEqual('You must provide a valid username');
          done();
        });
    });

    it('should fail login for nonexistent user', (done) => {
      const userDetails = {
        identifier: 'tobidosh',
        password: 'oreoluwa'
      };
      server.post('/user/login')
        .send(userDetails)
        .expect(/Incorrect Login Information/)
        .expect(403);
      done();
    });

    it('should fail login for incorrect password', (done) => {
      const userDetails = {
        identifier: 'oreoluwa',
        password: 'oreoluwadele'
      };
      server.post('/user/login')
        .send(userDetails)
        .expect(/Invalid credentials/)
        .expect(403);
      done();
    });

    it('should log in a user with valid details', (done) => {
      const userDetails = {
        identifier: 'oreoluwa',
        password: 'oreoluwa'
      };
      server.post('/user/login')
        .send(userDetails)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toBe(200);
          expect(res.body.message).toEqual('Login Successful! Token expires in one week.');
          done();
        });
    });

    it('should get the details of a user when valid token is supplied', (done) => {
      server.get('/user/1')
        .set({ Authorization: createdToken })
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(200);
          expect(res.body.user.username).toEqual('newuser');
        });
      done();
    });

    it('should get the details of all users when valid token is supplied', (done) => {
      server.get('/user/allusers')
        .set({ Authorization: createdToken })
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(200);
          expect(Array.isArray(res.body.users)).toBe(true);
        });
      done();
    });

    it('should successfully update user details with valid token supplied', (done) => {
      const fieldToUpdate = {
        username: 'updatedUser'
      };

      server.put('/user/1')
        .set({ Authorization: createdToken })
        .send(fieldToUpdate)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(200);
          expect(res.body.updatedUser.username).toEqual(fieldToUpdate.username);
        });
      done();
    });

    it('should fail user update for invalid token', (done) => {
      const fieldToUpdate = {
        username: 'invalidtokenuser'
      };

      server.put('/user/1')
        .set({ Authorization: 'invalid token' })
        .send(fieldToUpdate)
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(401);
          expect(res.body.message).toBeTruthy();
        });
      done();
    });

    it('should fail user update for invalid user param', (done) => {
      const fieldToUpdate = {
        username: 'invalidtokenuser'
      };

      server.put('/user/poly')
        .set({ Authorization: createdToken })
        .send(fieldToUpdate)
        .end((err, res) => {
          if (err) return err;
          expect(res.body.error).toEqual('ID should be a number');
          expect(res.status).toEqual(400);
        });
      done();
    });

    it('should fail to delete user when token is invalid', (done) => {
      server.delete('/user/1')
        .set({ Authorization: 'invalid' })
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(401);
          expect(res.body.message).toEqual('Invalid token');
          done();
        });
    });

    it('should fail to delete user when id is invalid', (done) => {
      server.delete('/user/546')
        .set({ Authorization: createdToken })
        .end((err, res) => {
          if (err) return err;
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('No user with the given ID');
          done();
        });
    });

    it('should fail to delete for non-integer param', (done) => {
      server.delete('/user/nonint')
        .set({ Authorization: createdToken })
        .expect(400)
        .expect(/ID should be a number/);
      done();
    });

    it('should successfully delete for valid ID and token', (done) => {
      server.delete('/user/1')
        .set({ Authorization: createdToken })
        .expect(200)
        .expect(/User removed/);
      done();
    });
  });
});

