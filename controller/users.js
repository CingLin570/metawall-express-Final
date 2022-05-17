const User = require("../models/usersModel");
const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const { checkAuth, generateSendJWT } = require('../service/auth');
const { errorHandle, successHandle } = require("../service/responseHandler");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

const users = {
  async getUsers(req, res) {
    const user = await User.find();
    successHandle(res, user);
  },
  register: handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;
    // 內容不可為空
    if(!email||!password||!confirmPassword||!name){
      return next(appError("400","欄位未填寫正確！",next));
    }
    // 密碼正確
    if(password!==confirmPassword){
      return next(appError("400","密碼不一致！",next));
    }
    // 密碼 8 碼以上
    if(!validator.isLength(password,{min:8})){
      return next(appError("400","密碼字數低於 8 碼",next));
    }
    // 是否為 Email
    if(!validator.isEmail(email)){
      return next(appError("400","Email 格式不正確",next));
    }
    
    // 加密密碼
    password = await bcrypt.hash(req.body.password,12);
    const newUser = await User.create({
      email,
      password,
      name
    });
    generateSendJWT(newUser,201,res);
  }),
  login: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError( 400,'新增失敗，帳號密碼不可為空',next));
    }
    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
      return next(appError(400,'新增失敗，您的密碼不正確',next));
    }
    generateSendJWT(user,200,res);
  }),
  getOwnProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, req.user);
  }),
  getProfileById: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    if(!id) {
      return next(appError(400,'使用者id必須填寫',next));
    }
    const findUser = await User.findById(id).exec();
    if(!findUser) {
      return next(appError(400,'查無此使用者id',next));
    }
    successHandle(res, findUser);
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { name, sex, photo } = req.body;
    if(!name) {
      next(appError(400,'更新失敗，姓名必填欄位未填寫',next));
    }
    const updateUser = await User.findByIdAndUpdate(req.user.id, {
      $set: {
        name,
        sex,
        photo
      },
    },
    { new: true });
    successHandle(res, updateUser);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password,confirmPassword } = req.body;
    if(password!==confirmPassword){
      return next(appError("400","密碼不一致！",next));
    }
    newPassword = await bcrypt.hash(password,12);
    
    const user = await User.findByIdAndUpdate(req.user.id,{
      password:newPassword
    });
    generateSendJWT(user,200,res)
  })
}

module.exports = users;