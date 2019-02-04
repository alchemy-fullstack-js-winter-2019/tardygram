const express = require('express');
const app = express();
const auth = require('../lib/routes/auth');
const posts = require('../lib/routes/posts');
const comments = require('../lib/routes/comments');
const users = require('../lib/routes/users');
const connection = require('./middleware/connection');
const { handler } = require('./middleware/error');
const notFound = require('./middleware/notFound');
const { bearerToken, ensureAuth } = require('./middleware/ensureUser');

app.use(express.json());
app.use(bearerToken);
app.use('/auth', connection, auth);
app.use('/posts', posts);
app.use('/comments', ensureAuth, comments);
app.use('/users', users);
app.use(notFound);
app.use(handler);

module.exports = app;
