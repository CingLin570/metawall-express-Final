var express = require('express');
var router = express.Router();
const UsersContollers = require('../controller/users');
const { checkAuth, generateSendJWT } = require('../service/auth');

// 註冊
router.post('/register', (req, res, next) => {
  /**
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '使用者註冊 API'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
        $name: '小明',
        $email: '123@gmail.com',
        $password: '12345678',
        $confirmPassword: '12345678'
      }
    }
   * #swagger.responses[200] = {
      description: '註冊資訊',
      schema: {
        status: 'success',
          user: {
            email: '123@gmail.com',
            name: '小明',
            password: '$2a$12$0/MetZwy....',
            sex: '',
            photo: ''
          }
        }
      }
 */
  UsersContollers.register(req, res, next);
});

// 登入
router.post('/login', function (req, res, next) {
  /**
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '使用者登入 API'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
        $email: '123@gmail.com',
        $password: '12345678',
      }
    }
   * #swagger.responses[200] = {
      description: '註冊資訊',
      schema: {
        status: 'success',
        user: {
          token: 'eyJhbGci...',
          name: '小明'
        }
      }
    }
 */
  UsersContollers.login(req, res, next);
});

// 取得個人資訊
router.get('/profile', checkAuth, function (req, res, next) {
  /**
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '取得個人資訊 API'
   * #swagger.parameters['Authorization'] = {
      in: 'header',
      type: 'string',
      required: true,
      description: 'Bearer token'
    }
   * #swagger.responses[200] = {
      description: '註冊資訊',
      schema: {
        status: 'success',
        message: {
          _id: '628fd55f474da4b3b4561323',
          name: '小明',
          sex: 'male'
        }
      }
    }
 */
  UsersContollers.getOwnProfile(req, res, next);
});

// 修改個人資訊
router.patch('/profile', checkAuth, function (req, res, next) {
  /**
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '修改個人資訊 API'
   * #swagger.parameters['Authorization'] = {
      in: 'header',
      type: 'string',
      required: true,
      description: 'Bearer token'
    }
   * #swagger.responses[200] = {
      description: '註冊資訊',
      schema: {
        status: 'success',
        message: {
          _id: '628fd55f474da4b3b4561323',
          name: '小明',
          sex: 'male'
        }
      }
    }
 */
  UsersContollers.updateProfile(req, res, next);
});

// 取得其他使用者資訊
router.get('/profile/:id', checkAuth, function (req, res, next) {
  /**
     * #swagger.tags = ['Users - 使用者']
     * #swagger.description = '查看其他用戶資訊'
     * #swagger.parameters['Authorization'] = {
            in: 'header',
            type: 'string',
            required: true,
            description: 'Bearer token'
        }
     * #swagger.parameters['id'] = {
            in: 'path',
            type: 'string',
            required: true,
            description: '用戶ID'
        }
     * #swagger.responses[200] = {
            description: 'user 資訊',
            schema: {
              status: 'success',
              message: {
                _id: '628fd55f474da4b3b4fmg323',
                name: '小明',
                sex: 'male'
              }
            }
        }
     */
  UsersContollers.getProfileById(req, res, next);
});

// 修改密碼
router.patch('/updatePassword', checkAuth, function (req, res, next) {
  /**
     * #swagger.tags = ['Users - 使用者']
     * #swagger.description = '更改密碼 API'
     * #swagger.parameters['Authorization'] = {
            in: 'header',
            type: 'string',
            required: true,
            description: 'Bearer token'
        }
     * #swagger.parameters['body'] = {
            in: 'body',
            type: 'object',
            required: true,
            description: '資料格式',
            schema: {
                $password: '12345678',
                $confirmPassword: '12345678'
            }
        }
     * #swagger.responses[200] = {
            description: 'user 資訊',
            schema: {
              status: 'success',
              user: {
                token: 'eyJhbGci...',
                name: '小明'
              }
            }
        }
     */
  UsersContollers.updatePassword(req, res, next);
});

module.exports = router;
