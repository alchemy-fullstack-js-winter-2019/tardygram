require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');
const app = require('../../lib/app');
const { getPost, getToken, getComment } = require('../dataHelpers');

describe('comments', () => {
  it('can post a comment', () => {
    return getPost()
      .then(post => {
        return request(app)
          .post('/comments')
          .send({ post: post._id, comment: 'blessed up bb' })
          .set('Authorization', `Bearer ${getToken()}`)
          .then(res => {
            expect(res.body).toEqual({ 
              commentBy: expect.any(String), 
              post: post._id, 
              comment: 'blessed up bb', 
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });
});

it('can delete a comment', () => {
  return getComment()
    .then(comment => {
      return Promise.all([
        Promise.resolve(comment),
        request(app)
          .delete(`/comments/${comment._id}`)
          .set('Authorization', `Bearer ${getToken()}`)
      ]) // eslint-disable-next-line no-unused-vars
        .then(([deletedComment, res]) => {
          expect(res.body).toEqual({ 
            commentBy: expect.any(String), 
            post: expect.any(String), 
            comment: expect.any(String), 
            _id: expect.any(String),
            __v: 0
          });
        });
    });
});

