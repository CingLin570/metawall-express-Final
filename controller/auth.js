const User = require('../models/usersModel');
const bcrypt = require('bcryptjs'); // 密碼加密
const { generateUrlJWT } = require('../service/auth');const handleErrorAsync = require('../service/handleErrorAsync');


const auth = {
  googleAuth: handleErrorAsync(async (req, res, next) => {
    const { email, sub, name, picture } = req.user
    const findUser = await User.findOne({ email });
    const user = await User.findOne({ email, googleId: sub });
    if(findUser && !user) {
      return res.redirect(`${process.env.APP_URL}/#/oauth?error=${encodeURIComponent('此使用者已註冊')}`);
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
      return res.redirect(`${process.env.APP_URL}/#/oauth?token=${generateUrlJWT(newUser)}`);
    }
    res.redirect(`${process.env.APP_URL}/#/oauth?token=${generateUrlJWT(user)}`);
  }),
  facebookAuth: handleErrorAsync(async (req, res, next) => {
    const { name, id, email, picture } = req.user
    const findUser = await User.findOne({ email });
    const user = await User.findOne({ email, facebookId: id });
    if(findUser && !user) {
      return res.redirect(`${process.env.APP_URL}/#/oauth?error=${encodeURIComponent('此使用者已註冊')}`);
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
      return res.redirect(`${process.env.APP_URL}/#/oauth?token=${generateUrlJWT(newUser)}`);
    }
    res.redirect(`${process.env.APP_URL}/#/oauth?token=${generateUrlJWT(user)}`);
  })
}

module.exports = auth;