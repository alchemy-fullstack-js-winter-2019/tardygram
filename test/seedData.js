const Post = require('../lib/models/Post');
const User = require('../lib/models/User');
const Comment = require('../lib/models/Comment');
const Chance = require('chance');
const chance = new Chance();

const DEFAULT_TOTAL_USERS = 10;
const DEFAULT_TOTAL_POSTS = 50;
const DEFAULT_TOTAL_COMMENTS = 100;

const profPic = 'https://media.mnn.com/assets/images/2013/02/grumpycat.jpg.560x0_q80_crop-smart.jpg';

const seedData = (totalUsers = DEFAULT_TOTAL_USERS, totalPosts = DEFAULT_TOTAL_POSTS, totalComments = DEFAULT_TOTAL_COMMENTS) => {
  return Promise.all(
    [...Array(totalUsers)].map((el, index) => {
      return User.create({ username: `person${index}`, password: 'password', profilePhotoUrl: profPic });
    })
  )
    .then(users => {
      return Promise.all(
        [...Array(totalPosts)].map(() => {
          return Post.create({ user: chance.pickone(users)._id, photoUrl: `${profPic}`, caption: 'yolo 420 cats be taking over', tags: ['#yolo', '#cats', '#420', '#blessed'] });
        })
      )
        .then(posts => {
          return Promise.all(
            [...Array(totalComments)].map(() => {
              return Comment.create({ commentBy: chance.pickone(users)._id, post: chance.pickone(posts)._id, comment: chance.sentence() });
            })
          );
        });
    });
};

module.exports = seedData;
