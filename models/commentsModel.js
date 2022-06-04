const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: [true, '留言內容為必填']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    require: ['true', '使用者ID為必填']
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'post',
    require: ['true', '貼文ID為必填']
  },
},
{
  versionKey: false,
})

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name id createdAt'
  });

  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;