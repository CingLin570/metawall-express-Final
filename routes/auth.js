const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthControllers = require('../controller/auth');

router.get('/google', passport.authenticate('google', {
  scope: [ 'email', 'profile' ],
}));

router.get('/google/callback', passport.authenticate('google',
{ session: false, failureRedirect: `${process.env.APP_URL}/login`, }),
AuthControllers.googleAuth);

router.get(
  '/facebook',
  passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['email', 'public_profile'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false,
    failureRedirect: `${process.env.APP_URL}/login` }),
    AuthControllers.facebookAuth);

module.exports = router;

  /**
   * #swagger.start
   * #swagger.path = '/google'
   * #swagger.method = 'get'
   * #swagger.tags = ['Auth - 第三方登入']
   * #swagger.description = '第三方登入Google API'
   * #swagger.responses[302] = {
      description: 'Google帳號登入授權',
      schema: '導頁至 Google 登入頁面'
    }
   * #swagger.end
 */

  /**
   * #swagger.start
   * #swagger.path = '/google/callback'
   * #swagger.method = 'get'
   * #swagger.tags = ['Auth - 第三方登入']
   * #swagger.description = '第三方登入Google(已授權) API'
   * #swagger.responses[302] = {
      description: 'Google帳號已授權，導入前台位置',
      schema: '導入前台位置'
    }
   * #swagger.end
 */

  /**
   * #swagger.start
   * #swagger.path = '/facebook'
   * #swagger.method = 'get'
   * #swagger.tags = ['Auth - 第三方登入']
   * #swagger.description = '第三方登入Facebook API'
   * #swagger.responses[302] = {
      description: 'Facebook帳號登入授權',
      schema: '導頁至 Facebook 登入頁面'
    }
   * #swagger.end
 */

  /**
   * #swagger.start
   * #swagger.path = '/facebook/callback'
   * #swagger.method = 'get'
   * #swagger.tags = ['Auth - 第三方登入']
   * #swagger.description = '第三方登入Facebook(已授權) API'
   * #swagger.responses[302] = {
      description: 'Facebook帳號已授權，導入前台位置',
      schema: '導入前台位置'
    }
   * #swagger.end
 */