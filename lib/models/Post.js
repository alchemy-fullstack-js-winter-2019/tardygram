const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  photoUrl: {
    type: String,
    required: true
  },
  caption:{
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: true
  }
});

const groupByUser = () => ({ $group: { _id: '$user', count: { $sum: 1 } } });
const sortByDesc = () => ({ $sort: { count: -1 } });
const limitBy10 = () => ({ $limit: 10 });
const getUserInfo = () =>  ({ $lookup: {
  from: 'users',
  localField: '_id',
  foreignField: '_id',
  as: 'user'
}
});

postSchema.statics.getProlificUsers = function() {
  return this.aggregate([
    groupByUser(),
    sortByDesc(),
    limitBy10(),
    getUserInfo()
  ]);
};

module.exports = mongoose.model('Post', postSchema);
