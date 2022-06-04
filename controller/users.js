const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const { generateSendJWT } = require('../service/auth');
const { successHandle } = require('../service/responseHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');

const users = {
  getOwnProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, req.user);
  }),
  getLikeList: handleErrorAsync(async (req, res, next) => {
    const likeList = await Post.find({
      likes: { $in: [req.user.id] }
    }).populate({
      path:"user",
      select:"name _id"
    }).sort('-createdAt');
    successHandle(res, likeList);
  }),
  register: handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;
    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return next(appError('400', '欄位未填寫正確！', next));
    }
    const errorMessageArr = [];
    // 密碼是否正確
    if (password !== confirmPassword) {
      errorMessageArr.push('密碼不一致！');
    }
    // 密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      errorMessageArr.push(
        '密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母'
      );
    }
    // 暱稱是否為至少兩個字元
    if (!validator.isLength(name, { min: 2 })) {
      errorMessageArr.push('暱稱至少兩個字元');
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      errorMessageArr.push('Email 格式不正確');
    }
    if (errorMessageArr.length > 0) {
      errorMessage = errorMessageArr.join(', ');
      return next(appError(400, errorMessage, next));
    }
    // 查詢是否存在信箱
    const findUserByMail = await User.findOne({ email });
    if (findUserByMail) {
      return appError('email 已註冊', 400, next);
    }
    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name,
      sex: '',
      photo: '',
    });
    successHandle(res, newUser);
  }),
  login: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, '登入失敗，帳號密碼不可為空', next));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return appError('登入失敗，帳號錯誤或尚未註冊', 400, next);
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, '登入失敗，您的密碼不正確', next));
    }
    generateSendJWT(user, 200, res);
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { name, sex, photo } = req.body;
    if (!name) {
      next(appError(400, '更新失敗，姓名必填欄位未填寫', next));
    }
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name,
          sex,
          photo,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    successHandle(res, updateUser);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const errorMessageArr = [];
    // 密碼是否正確
    if (password !== confirmPassword) {
      errorMessageArr.push('密碼不一致！');
    }
    // 密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      errorMessageArr.push(
        '密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母'
      );
    }
    if (errorMessageArr.length > 0) {
      errorMessage = errorMessageArr.join(', ');
      return next(appError(400, errorMessage, next));
    }
    newPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });
    generateSendJWT(user, 200, res);
  }),
  createFollow: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const followUser = req.params.id
    if(followUser === user) {
      return next(appError(400, '新增失敗，您不能追蹤自己', next));
    }
    const findUser = await User.findById(followUser);
    if(!findUser) {
      return appError(400, '新增失敗，查無此使用者ID', next);
    }
    await User.updateOne(
      {
        _id: user,
        'following.user': { $ne: followUser }
      },
      {
        $addToSet: { following: { user: followUser } }
      }
    );
    await User.updateOne(
      {
        _id: followUser,
        'followers.user': { $ne: user }
      },
      {
        $addToSet: { followers: { user: user } }
      }
    );
    successHandle(res, '新增追蹤成功');
  }),
  deleteFollow: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const followUser = req.params.id
    if(followUser === user) {
      return next(appError(400, '刪除失敗，您不能取消追蹤自己', next));
    }
    const findUser = await User.findById(followUser);
    if(!findUser) {
      return appError(400, '刪除失敗，查無此使用者ID', next);
    }
    await User.updateOne(
      {
        _id: user,
        'following.user': { $eq: followUser }
      },
      {
        $pull: { following: { user: followUser } }
      }
    );
    await User.updateOne(
      {
        _id: followUser,
        'followers.user': { $eq: user }
      },
      {
        $pull: { followers: { user: user } }
      }
    );
    successHandle(res, '取消追蹤成功');
  }),
  getFollowing: handleErrorAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    .populate({
      path: 'following',
      populate: { 
          path: 'user',
          select: 'name photo'
      },
      options: { sort: '-createdAt' }
    });
    successHandle(res, user);
  })
};

module.exports = users;
