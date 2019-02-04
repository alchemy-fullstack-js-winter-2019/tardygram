require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');

const app = require('../../lib/app');

describe('users', () => {
  it('can get users with the most posts', () => {
    return request(app)
      .get('/users/prolific')
      .then(({ body }) =>  {
        expect(body).toHaveLength(10);
        expect(body[0].user[0]).toEqual({
          __v: 0,
          _id: expect.any(String),
          username: expect.any(String),
          passwordHash: expect.any(String),
          profilePhotoUrl: expect.any(String)
        });
      });
  });

});
