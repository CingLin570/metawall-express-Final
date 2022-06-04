const express = require('express');
const router = express.Router();
const UsersControllers = require('../controller/users');
const { checkAuth } = require('../service/auth');

// 註冊
router.post('/user/register', UsersControllers.register);
// 登入
router.post('/user/login', UsersControllers.login);
// 取得個人資訊
router.get('/user/profile', checkAuth, UsersControllers.getOwnProfile);
// 修改個人資訊
router.patch('/user/profile', checkAuth, UsersControllers.updateProfile);
// 修改密碼
router.patch('/user/updatePassword', checkAuth, UsersControllers.updatePassword);
// 取得個人按讚列表
router.get('/user/getLikeList', checkAuth, UsersControllers.getLikeList);
// 追蹤使用者
router.post('/user/:id/follow', checkAuth, UsersControllers.createFollow);
// 取消追蹤使用者
router.delete('/user/:id/follow', checkAuth, UsersControllers.deleteFollow);
// 取得追蹤使用者
router.get('/user/following', checkAuth, UsersControllers.getFollowing);

module.exports = router;
  /**
   * #swagger.start
   * #swagger.path = '/user/register'
   * #swagger.method = 'post'
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
        $password: 'AAbb1234',
        $confirmPassword: 'AAbb1234'
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
   * #swagger.end
 */

  /**
   * #swagger.start
   * #swagger.path = '/user/login'
   * #swagger.method = 'post'
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
   * #swagger.end
 */

  /**
   * #swagger.start
   * #swagger.path = '/user/profile'
   * #swagger.method = 'get'
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
   * #swagger.end
 */

  /**
   * #swagger.start
   * #swagger.path = '/user/profile'
   * #swagger.method = 'patch'
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
   * #swagger.end
 */

  /**
   * #swagger.start
   * #swagger.path = '/user/updatePassword'
   * #swagger.method = 'patch'
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
   * #swagger.end
  */

  /**
   * #swagger.start
   * #swagger.path = '/user/getLikeList'
   * #swagger.method = 'get'
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '取得個人按讚列表 API'
   * #swagger.parameters['Authorization'] = {
      in: 'header',
      type: 'string',
      required: true,
      description: 'Bearer token'
    }
   * #swagger.responses[200] = {
      description: '此使用者按讚的貼文資訊',
      schema: {
        status: 'success',
        message: [{
          _id: '6278da02631ef7910e7adc37',
          content: '今天天氣真好',
          image: '',
          user: {
            _id: '6277b20ad980d4df45db6447',
            name: '小明',
            photo: ''
          },
          likes: [
            '6295818161225bb583801a84'
          ],
          createdAt: '2022-05-11T01:41:18.681Z'
        }]
      }
    }
  }
   * #swagger.end
  */

  /**
   * #swagger.start
   * #swagger.path = '/user/{id}/follow'
   * #swagger.method = 'post'
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '追蹤使用者 API'
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
      description: '追蹤使用者ID'
    }
   * #swagger.responses[200] = {
      description: '此使用者按讚的貼文資訊',
      schema: {
        status: 'success',
        message: '新增追蹤成功'
      }
    }
  }
   * #swagger.end
  */

  /**
   * #swagger.start
   * #swagger.path = '/user/{id}/follow'
   * #swagger.method = 'delete'
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '取消追蹤使用者 API'
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
      description: '追蹤使用者ID'
    }
   * #swagger.responses[200] = {
      description: '此使用者按讚的貼文資訊',
      schema: {
        status: 'success',
        message: '取消追蹤成功'
      }
    }
  }
   * #swagger.end
  */

  /**
   * #swagger.start
   * #swagger.path = '/user/following'
   * #swagger.method = 'get'
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '取得追蹤使用者 API'
   * #swagger.parameters['Authorization'] = {
      in: 'header',
      type: 'string',
      required: true,
      description: 'Bearer token'
    }
   * #swagger.responses[200] = {
      description: '此使用者按讚的貼文資訊',
      schema: {
        status: 'success',
        message: [{
          _id: '6278da02631ef7910e7adc37',
          name: '小王',
          photo: '',
          sex: '',
          followers: [{}],
          following: [{
            user: {
              _id: '6295d56b901f7c53926520ec',
              name: '小明',
              photo: '',
            },
            _id: '629966494b2dad46121e9da8',
            createdAt: '2022-05-11T01:41:18.681Z'
          }]
        }]
      }
    }
  }
   * #swagger.end
  */