const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Verification = require('../models/VerificationMailModel')
const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const { generateSendJWT } = require('../service/auth');
const { successHandle } = require('../service/responseHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const checkMongoObjectId = require('../service/checkMongoObjectId');
const sendmail = require('../service/sendMail');

const users = {
  register: handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;
    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return appError(400, '欄位未填寫正確！', next);
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
      return appError(400, errorMessage, next);
    }
    // 查詢是否存在信箱
    const findUserByMail = await User.findOne({ email });
    if (findUserByMail) {
      return appError(400, 'Email 已註冊', next);
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
    const errorMessageArr = [];
    // 帳號密碼不可為空
    if (!email || !password) {
      return appError(400, '帳號密碼不可為空', next);
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      errorMessageArr.push('登入失敗，Email 格式不正確');
    }
    // 密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      errorMessageArr.push(
        '登入失敗，密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母'
      );
    }
    if (errorMessageArr.length > 0) {
      errorMessage = errorMessageArr.join(', ');
      return appError(400, errorMessage, next);
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return appError(400, '登入失敗，帳號錯誤或尚未註冊', next);
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return appError(400, '登入失敗，您的密碼不正確', next);
    }
    generateSendJWT(user, 200, res);
  }),
  getOwnProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, req.user);
  }),
  getUserProfile: handleErrorAsync(async (req, res, next) => {
    const otherUserId = req.params.id;
    const userId = req.user.id;
    if(!checkMongoObjectId(otherUserId)) {
      return appError(400, '取得失敗，請輸入正確的ID格式', next);
    }
    const findUser = await User.findById(otherUserId);
    if(!findUser) {
      return appError(400, '取得失敗，查無此使用者ID', next);
    }
    const { name, photo, followers } = findUser
    followerLength = followers.length;
    const checkFollow = await User.findOne({
      _id: otherUserId,
      'followers.user': { $in: userId }
    }).count().exec();
    successHandle(res, { name, photo, followerLength, checkFollow });
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { name, sex, photo } = req.body;
    if (!name) {
      return appError(400, '更新失敗，姓名必填欄位未填寫', next);
    }
    if (!sex) {
      return appError(400, '更新失敗，性別必填欄位未填寫', next);
    }
    const updateUser = await User.findByIdAndUpdate(
      userId,
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
    const userId = req.user.id;
    const errorMessageArr = [];
    // 密碼與確認密碼不可為空
    if (!password || !confirmPassword) {
      return appError(400, '密碼與確認密碼不可為空', next);
    }
    // 密碼是否正確
    if (password !== confirmPassword) {
      errorMessageArr.push('密碼不一致！');
    }
    // 密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母
    if (!validator.isStrongPassword(password, {
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
      return appError(400, errorMessage, next);
    }
    newPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(userId, {
      password: newPassword,
    });
    generateSendJWT(user, 200, res);
  }),
  getLikeList: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const likeList = await Post.find({
      likes: { $in: [userId] }
    }).populate({
      path:"user",
      select:"name _id photo"
    }).sort('-createdAt');
    successHandle(res, likeList);
  }),
  createFollow: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const followUser = req.params.id
    if(!checkMongoObjectId(followUser)) {
      return appError(400, '新增失敗，請輸入正確的ID格式', next);
    }
    if(followUser === userId) {
      return appError(400, '新增失敗，您不能追蹤自己', next);
    }
    const findUser = await User.findById(followUser);
    if(!findUser) {
      return appError(400, '新增失敗，查無此使用者ID', next);
    }
    await User.updateOne(
      {
        _id: userId,
        'following.user': { $ne: followUser }
      },
      {
        $addToSet: { following: { user: followUser } }
      }
    );
    await User.updateOne(
      {
        _id: followUser,
        'followers.user': { $ne: userId }
      },
      {
        $addToSet: { followers: { user: userId } }
      }
    );
    successHandle(res, '新增追蹤成功');
  }),
  deleteFollow: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const followUser = req.params.id
    if(!checkMongoObjectId(followUser)) {
      return appError(400, '新增失敗，請輸入正確的ID格式', next);
    }
    if(followUser === userId) {
      return appError(400, '刪除失敗，您不能取消追蹤自己', next);
    }
    const findUser = await User.findById(followUser);
    if(!findUser) {
      return appError(400, '刪除失敗，查無此使用者ID', next);
    }
    await User.updateOne(
      {
        _id: userId,
        'following.user': { $eq: followUser }
      },
      {
        $pull: { following: { user: followUser } }
      }
    );
    await User.updateOne(
      {
        _id: followUser,
        'followers.user': { $eq: userId }
      },
      {
        $pull: { followers: { user: userId } }
      }
    );
    successHandle(res, '取消追蹤成功');
  }),
  getFollowing: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const findUser = await User.findById(userId)
    .populate({
      path: 'following',
      populate: { 
          path: 'user',
          select: 'name photo'
      },
      options: { sort: '-createdAt' }
    });
    successHandle(res, findUser);
  }),
  forgetPassword: handleErrorAsync(async (req, res, next) => {
    const { email } = req.body;
    // 內容不可為空
    if (!email) {
      return appError(400, 'Email欄位未填寫正確！', next);
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      return appError(400, 'Email 格式不正確', next);
    }
    // 查詢是否存在信箱
    const findUserByMail = await User.findOne({ email }).select('+email');
    if (!findUserByMail) {
      return appError(400, 'Email 尚未註冊', next);
    }
    await Verification.findOneAndDelete({ userId: findUserByMail._id.toString() })
    const { verification } = await Verification.create({
      userId: findUserByMail._id,
      verification: (Math.floor(Math.random() * 9000) + 1000).toString(),
    })
    sendmail(findUserByMail, verification, res, next);
  }),
  verification: handleErrorAsync(async (req, res, next) => {
    const { email } = req.body;
    // 內容不可為空
    if (!email) {
      return appError(400, 'Email欄位未填寫正確！', next);
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      return appError(400, 'Email 格式不正確', next);
    }
    // 查詢是否存在信箱
    const findUserByMail = await User.findOne({ email }).select('+password');
    if (!findUserByMail) {
      return appError(400, 'Email 尚未註冊', next);
    }
    const inputVerification = req.body.verification;
    if(!inputVerification) {
      return appError(400, '驗證碼必須填寫', next);
    }
    const { verification } = await Verification.findOne({ userId: findUserByMail._id })
    console.log(verification)
    if (inputVerification !== verification) {
      return appError(400, '驗證碼填寫錯誤，請重新填寫', next);
    }
    generateSendJWT(findUserByMail, 200, res);
  })
};

module.exports = users;
