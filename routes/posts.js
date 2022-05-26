const express = require('express');
const router = express.Router();
const PostsContollers = require('../controller/posts');
const { checkAuth, generateSendJWT } = require('../service/auth');

// 取得特定條件posts
router.get('/posts', checkAuth, (req, res, next) => {
  /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '取得全部貼文 API'
     * #swagger.parameters['Authorization'] = {
            in: 'header',
            type: 'string',
            required: true,
            description: 'Bearer token'
        }
     * #swagger.parameters['timeSort'] = {
            in: 'query',
            type: 'string',
            required: false,
            description: '排序：desc/asc'
        }
     * #swagger.parameters['q'] = {
            in: 'query',
            type: 'string',
            required: false,
            description: '關鍵字搜尋'
        }
     * #swagger.responses[200] = {
          description: '貼文資訊',
          schema: {
            "status": "success",
            "message": [{
              "_id": "6278da02631ef7910e7adc37",
              "content": "今天天氣真好",
              "image": "",
              "user": {
                "_id": "6277b20ad980d4df45db6447",
                "name": "Johnny",
                "photo": ""
              },
              "likes": 0
            }]
          }
        }
      }
     */
  PostsContollers.getPosts(req, res, next);
});
// 新增單一post
router.post('/post', checkAuth, (req, res, next) => {
  /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '新增單筆貼文 API'
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
          $content: '今天天氣真好',
          image: 'https://i.imgur.com/ktss1mN.jpg',
          }
        }
     * #swagger.responses[200] = {
          description: '貼文資訊',
          schema: {
            "status": "success",
            "message": [{
              "_id": "6278b537c393fa2485a7eea4",
              "content": "今天天氣真好",
              "image": "https://i.imgur.com/ktss1mN.jpg",
              "user": {
                "_id": "6277b20ad980d4df45db6447",
                "name": "Johnny",
                "photo": ""
              },
            "likes": 0
            }]
          }
        }
      }
     */
  PostsContollers.createPosts(req, res, next);
});
// 刪除全部posts
router.delete('/posts', (req, res, next) => {
  /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '刪除全部貼文 API'
     * #swagger.responses[200] = {
        description: '貼文資訊',
        schema: {
          "status": "success",
          "message": {
            "acknowledged": true,
            "deletedCount": 10
          }
        }
      }
     */
  PostsContollers.deleteAllPosts(req, res, next);
});
// 刪除單一posts
router.delete('/post/:id', (req, res, next) => {
  /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '刪除單筆貼文 API'
     * #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: '貼文ID'
        }
     * #swagger.responses[200] = {
      description: '貼文資訊',
        schema: {
          "status": "success",
          "message": {
          "_id": "627b143e88edb2f730f97feb",
          "content": "今天天氣真好",
          "image": "https://i.imgur.com/ktss1mN.jpg",
          "user": "6277b20ad980d4df45db6447",
          "likes": 0,
          "createdAt": "2022-05-11T01:41:18.681Z"
          }
        }
      }
     */
  PostsContollers.deleteOnePosts(req, res, next);
});
// 修改單一post
router.patch('/post/:id', (req, res, next) => {
  /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '修改單筆貼文 API'
     * #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: '貼文ID'
        }
     * #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: '資料格式',
        schema: {
          $content: '今天天氣真好',
          image: 'https://i.imgur.com/ktss1mN.jpg',
          user: '6277b20ad980d4df45db6447',
          likes: 123
          }
        }
     * #swagger.responses[200] = {
      description: '貼文資訊',
        schema: {
          "status": "success",
          "message": {
          "_id": "627b143e88edb2f730f97feb",
          "content": "今天天氣真好",
          "image": "https://i.imgur.com/ktss1mN.jpg",
          "user": "6277b20ad980d4df45db6447",
          "likes": 0,
          "createdAt": "2022-05-11T01:41:18.681Z"
          }
        }
      }
     */
  PostsContollers.updatePosts(req, res, next);
});

module.exports = router;
