require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');
const User = require('../../lib/models/User');
const app = require('../../lib/app');
const mongoose = require('mongoose');

const profPic = 'https://media.mnn.com/assets/images/2013/02/grumpycat.jpg.560x0_q80_crop-smart.jpg';

describe.only('auth', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can signup a new user', done => {
    return request(app)
      .post('/auth/signup')
      .send({ username: 'sl4yr92', password: 'password', profilePhotoUrl: profPic })
      .then(res => {
        expect(res.body).toEqual({
          user: {
            username: 'sl4yr92',
            profilePhotoUrl: profPic,
            _id: expect.any(String)
          },
          token: expect.any(String)
        });
        done();
      });
  });

  it('can signin a user', () => {
    return User.create({ username: 'sk8rboi91', password: 'pass', profilePhotoUrl: profPic })
      .then(user => {
        return request(app)
          .post('/auth/signin')
          .send({ username: 'sk8rboi91', password: 'pass' })
          .then(res => {
            expect(res.body).toEqual({
              user: {
                username: 'sk8rboi91',
                profilePhotoUrl: profPic,
                _id: user._id.toString()
              },
              token: expect.any(String)
            });
          });
      });
  });

  it('can throw an error if a bad signin', () => {
    return User.create({ username: 'y0l02001', password: 'pass', profilePhotoUrl: profPic })
      .then(user => {
        return request(app)
          .post('/auth/signin')
          .send({ username: user.username, password: 'p3ss' })
          .then(res => {
            expect(res.status).toEqual(401);
          });
      });
  });

  it('cannot sign in a user with a bad username', () => {
    return User.create({ username: 'pnkprncss85', password: 'pass', profilePhotoUrl: profPic })
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({ username: 'punkprincess85', password: 'p3ss' })
          .then(res => {
            expect(res.status).toEqual(401);
          });
      });
  });

  it('can ensureAuth at /verify', () => {
    return User.create({ username: 'INflewenc3r', password: 'pass', profilePhotoUrl: profPic })
      .then(user => {
        return request(app)
          .post('/auth/signin')
          .send({ username: user.username, password: 'pass' })
          .then(res => res.body.token);
      }).then(token => {
        return request(app)
          .get('/auth/verify')
          .set('Authorization', `Bearer ${token}`);
      }).then(res => {
        expect(res.body).toEqual({
          username: 'INflewenc3r',
          profilePhotoUrl: profPic,
          _id: expect.any(String)
        });
      });
  });
  afterAll((done) => {
    mongoose.disconnect(done);
  }); 
});
