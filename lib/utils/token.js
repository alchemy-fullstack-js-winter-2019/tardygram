const jwt = require('jsonwebtoken');
const EXPIRE_IN = '1h';

const tokenize = payload => {
  const token = jwt.sign({ payload }, 
    process.env.AUTH_SECRET,
    { expiresIn: EXPIRE_IN });
  return token;
};

const untokenize = token => {
  const body = jwt.verify(token, process.env.AUTH_SECRET);
  return body.payload;
};

module.exports = { tokenize, untokenize }; 
