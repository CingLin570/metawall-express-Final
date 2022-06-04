const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '貼文內容 Content 未填寫'],
    },
    image: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, '貼文 ID 未填寫'],
    },
    likes: [
      { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user' 
      }
    ],
  },
  {
    versionKey: false,
    toJSON: { 
      virtuals: true,
      transform: function (doc, ret) { delete ret.id }
    },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
