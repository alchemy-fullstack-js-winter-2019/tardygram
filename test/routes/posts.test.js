require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');

const app = require('../../lib/app');
const { getUser, getPost, getPosts, getToken } = require('../dataHelpers');

const profPic = 'https://media.mnn.com/assets/images/2013/02/grumpycat.jpg.560x0_q80_crop-smart.jpg';

describe.only('posts', () => {
  it('can post a new post from a user', () => {
    return getUser({ username: 'person0' })
      .then(user => {
        return request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${getToken()}`)
          .send({
            user: user._id,
            photoUrl: profPic,
            caption: 's lit',
            tags: ['#litty', '#blessed'],
          });
      }).then(res => {
        expect(res.body).toEqual({
          photoUrl: profPic,
          caption: 's lit',
          tags: ['#litty', '#blessed'],
          __v: 0,
          _id: expect.any(String)
        });
      });
  });
  it('can get alllll the posts', () => {
    return request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${getToken()}`)
      .then(res => {
        return Promise.all([
          Promise.resolve(res.body),
          getPosts()
        ]);
      }).then(([body, posts]) => {
        expect(body).toHaveLength(posts.length);
      });
  });
  it('gets a post by id', () => {
    return getPost()
      .then(post => {
        return Promise.all([
          Promise.resolve(post), 
          request(app)
            .get(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${getToken()}`)
        ]);
      })
      .then(([post, res]) => {
        console.log('!!!', post);
        expect(res.body).toEqual({
          caption: 'yolo 420 cats be taking over',
          photoUrl: 'https://media.mnn.com/assets/images/2013/02/grumpycat.jpg.560x0_q80_crop-smart.jpg',
          tags:[
            '#yolo',
            '#cats',
            '#420',
            '#blessed',
          ],
          user:{
            _id: expect.any(String),
            username: 'person0',
          },
        });
      });
  });
});
