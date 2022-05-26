const jwt = require('jsonwebtoken');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const User = require('../models/usersModel');

const checkAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  let auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    token = auth.split(' ')[1];
  }

  if (!token) {
    return next(appError(401, '你尚未登入！', next));
  }

  // 驗證 token 正確性
  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return appError(404, '驗證失敗，請重新登入', next);
      } else {
        return payload
      }
    });
  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;
  next();
});
const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    user: {
      token,
      name: user.name,
      photo: user.photo
    },
  });
};

module.exports = {
  checkAuth,
  generateSendJWT,
};
