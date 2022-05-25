const User = require('../models/usersModel');
const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const { checkAuth, generateSendJWT } = require('../service/auth');
const { errorHandle, successHandle } = require('../service/responseHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
// 設定預設 isStrongPassword 驗證
const defaultOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 0,
  returnScore: false,
  pointsPerUnique: 0,
  pointsPerRepeat: 0,
  pointsForContainingLower: 0,
  pointsForContainingUpper: 0,
  pointsForContainingNumber: 0,
  pointsForContainingSymbol: 0,
};
const users = {
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
    // 密密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母
    if (!validator.isStrongPassword(password, defaultOptions)) {
      errorMessageArr.push('密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母');
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
    // 查詢是否存在已註冊名稱以及信箱
    await User.findOne({ $or: [{ email }, { name }] })
      .select('+email')
      .exec(async (err, user) => {
        if (user) {
          const existsUser =
            user.email === email.toLowerCase()
              ? user.name === name.trim()
                ? '信箱與使用者名稱重複，請重新輸入'
                : '信箱重複，請重新輸入'
              : '使用者名稱重複，請重新輸入';
          next(appError(400, existsUser, next));
        } else {
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
        }
      });
  }),
  login: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, '新增失敗，帳號密碼不可為空', next));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return appError('新增失敗，帳號錯誤或尚未註冊', 400, next);
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, '新增失敗，您的密碼不正確', next));
    }
    generateSendJWT(user, 200, res);
  }),
  getOwnProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, req.user);
  }),
  getProfileById: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      return next(appError(400, '取得失敗，使用者id必須填寫', next));
    }
    const findUser = await User.findById(id).exec();
    if (!findUser) {
      return next(appError(400, '取得失敗，查無此使用者id', next));
    }
    const { name, photo } = findUser;
    successHandle(res, { name, photo });
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
    if (!validator.isStrongPassword(password, defaultOptions)) {
      errorMessageArr.push('密碼需符合八碼以上並英數混合，至少各一個大小寫英文字母');
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
};

module.exports = users;
