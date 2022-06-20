const User = require('../models/usersModel');
const bcrypt = require('bcryptjs'); // 密碼加密
const appError = require('../service/appError');
const { generateUrlJWT } = require('../service/auth');const handleErrorAsync = require('../service/handleErrorAsync');


const auth = {
  googleAuth: handleErrorAsync(async (req, res, next) => {
    const { email, sub, name, picture } = req.user
    const findUser = await User.findOne({ email });
    const user = await User.findOne({ email, googleId: sub });
    if(findUser && !user) {
      return res.redirect(`http://localhost:8080/#/oauth?error=${encodeURIComponent('此使用者已註冊')}`);
    }
    if(!user) {
      // 加密密碼
      password = await bcrypt.hash(sub, 12);
      const newUser = await User.create({
        name,
        password,
        googleId: sub,
        email,
        photo: picture,
      });
      return res.redirect(`http://localhost:8080/#/oauth?token=${generateUrlJWT(newUser)}`);
    }
    res.redirect(`http://localhost:8080/#/oauth?token=${generateUrlJWT(user)}`);
  }),
  facebookAuth: handleErrorAsync(async (req, res, next) => {
    const { name, id, email, picture } = req.user
    const findUser = await User.findOne({ email });
    const user = await User.findOne({ email, facebookId: id });
    if(findUser && !user) {
      return res.redirect(`http://localhost:8080/#/oauth?error=${encodeURIComponent('此使用者已註冊')}`);
    }
    if(!user) {
      // 加密密碼
      password = await bcrypt.hash(id, 12);
      const newUser = await User.create({
        name,
        password,
        facebookId: id,
        email,
        photo: picture.data.url,
      });
      return res.redirect(`http://localhost:8080/#/oauth?token=${generateUrlJWT(newUser)}`);
    }
    res.redirect(`http://localhost:8080/#/oauth?token=${generateUrlJWT(user)}`);
  })
}

module.exports = auth;