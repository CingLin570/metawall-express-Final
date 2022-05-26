const express = require('express');
const router = express.Router();
const UsersContollers = require('../controller/users');
const { checkAuth, generateSendJWT } = require('../service/auth');

// 註冊
router.post('/user/register', (req, res, next) => {
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
            _id: '628f85asdbf89ddf2da4ce586',
            email: '123@gmail.com',
            name: '小明',
            password: '$2a$12$0/MetZwy....',
            sex: '',
            photo: '',
            createdAt: '2022-05-11T01:41:18.681Z'
          }
        }
      }
 */
  UsersContollers.register(req, res, next);
});

// 登入
router.post('/user/login', function (req, res, next) {
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
        $password: 'AAbb1234',
      }
    }
   * #swagger.responses[200] = {
      description: '註冊資訊',
      schema: {
        status: 'success',
        user: {
          token: 'eyJhbGci...',
          name: '小明',
          photo: 'https://i.imgur.com/ktss1mN.jpg'
        }
      }
    }
 */
  UsersContollers.login(req, res, next);
});

// 取得個人資訊
router.get('/user/profile', checkAuth, function (req, res, next) {
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
          sex: 'male',
          photo: 'https://i.imgur.com/ktss1mN.jpg'
        }
      }
    }
 */
  UsersContollers.getOwnProfile(req, res, next);
});

// 修改個人資訊
router.patch('/user/profile', checkAuth, function (req, res, next) {
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
          sex: 'male',
          photo: 'https://i.imgur.com/ktss1mN.jpg'
        }
      }
    }
 */
  UsersContollers.updateProfile(req, res, next);
});

// 修改密碼
router.patch('/user/updatePassword', checkAuth, function (req, res, next) {
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
                $password: 'AAbb1234',
                $confirmPassword: 'AAbb1234'
            }
        }
     * #swagger.responses[200] = {
            description: 'user 資訊',
            schema: {
              status: 'success',
              user: {
                token: 'eyJhbGci...',
                name: '小明',
                photo: 'https://i.imgur.com/ktss1mN.jpg'
              }
            }
        }
     */
  UsersContollers.updatePassword(req, res, next);
});

module.exports = router;
