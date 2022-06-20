const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字'],
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      trim: true,
      select: false,
    },
    photo: String,
    sex: {
      type: String,
      enum: ['male', 'female',''],
      default:''
    },
    password: {
      type: String,
      required: [true, '請輸入密碼'],
      minlength: 8,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    followers: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'user' },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    following: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'user' },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    googleId: {
      type: String,
      default: ''
    },
    facebookId: {
      type: String,
      default: ''
    },
  },
  {
    versionKey: false,
  }
);
const User = mongoose.model('user', userSchema);

module.exports = User;
