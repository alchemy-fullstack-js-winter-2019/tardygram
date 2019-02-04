const { Router } = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { HttpError } = require('../middleware/error');
const { ensureAuth } = require('../middleware/ensureUser');

const patcher = (body, fields) => {
  return Object.keys(body)
    .reduce((acc, key) => {
      if(fields.includes(key) && body[key]) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
};

const posts = Router()
  .get('/popular', ensureAuth, (req, res, next) => {
    Comment
      .mostComments()
      .then(most => {
        res.send(most);
      })
      .catch(next);
  })
  .post('/', ensureAuth, (req, res, next) => {
    const { photoUrl, caption, tags } = req.body;
    Post
      .create({ 
        username: req.user._id, 
        photoUrl, 
        caption, 
        tags 
      })
      .then(post => {
        res.send(post);
      }).catch(next);
  })
  .get('/', (req, res, next) => {
    Post
      .find()
      .populate('user', { username: true })
      .select('-__v -_id')
      .then(posts => res.send(posts))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    return Promise.all([
      Post
        .findById(req.params.id)
        .populate('user', { username: true })
        .lean()
        .select('-__v -_id'),
      Comment
        .find({ post: req.params.id })
        .populate('commentBy', { username: true })
        .select('-__v -_id')
    ])
      .then(([post, comments]) => {
        if(!post) {
          return next(new HttpError(404, 'Not found'));
        }
        res.send({ ...post, comments });
      })  
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    const patched = patcher(req.body, ['caption']);
    Post
      .findByIdAndUpdate(req.params.id, patched, { new: true })
      .populate('user', { username: true })
      .select('-__v -_id')
      .then(post => res.send(post))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Post 
      .findByIdAndDelete(req.params.id)
      .then(() => {
        res.send({ deleted: 1 });
      })
      .catch(next);
  });
  

module.exports = posts;
