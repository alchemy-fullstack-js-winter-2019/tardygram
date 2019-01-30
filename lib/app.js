const express = require('express');
const app = express();
const auth = require('../lib/routes/auth');
const connection = require('./middleware/connection');
const { handler } = require('./middleware/error');
const notFound = require('./middleware/notFound');
const { bearerToken } = require('./middleware/ensureUser');

app.use(express.json());
app.use(bearerToken);
app.use('/auth', connection, auth);
app.use(notFound);
app.use(handler);

module.exports = app;
