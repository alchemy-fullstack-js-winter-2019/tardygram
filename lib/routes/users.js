const { Router } = require('express');
const Post = require('../models/Post');

const users = Router()
  .get('/prolific', (req, res, next) => {
    Post
      .getProlificUsers()
      .then(users => {
        res.send(users);
      })
      .catch(next);
  });

module.exports = users;
