const mongoose = require('mongoose');
const { hash, compare } = require('../utils/hash');
const { tokenize, untokenize } = require('../utils/token');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
  },
  passwordHash: String,
  profilePhotoUrl: {
    type: String,
    required: [true, 'Photo URL is required']
  }
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash,
      delete ret.__v;
    }
  }
});

userSchema
  .virtual('password')
  .set(function(password) {
    this._tempPassword = password;
  });

userSchema
  .pre('save', function(next) {
    hash(this._tempPassword)
      .then(hashedPassword => {
        this.passwordHash = hashedPassword;
        next();
      });
  });

userSchema.methods.compare = function(password) {
  return compare(password, this.passwordHash);
};

userSchema.statics.findByToken = function(token) {
  return Promise.resolve(untokenize(token));
};

userSchema.methods.authToken = function() {
  const user = this.toJSON();
  return tokenize(user);
};

module.exports = mongoose.model('User', userSchema);
