var express = require('express');
var router = express.Router();
const PostsContollers = require("../controller/posts");

// 取得特定條件posts
router.get('/', (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '取得全部貼文 API'
     * #swagger.parameters['sort'] = {
            in: 'query',
            type: 'string',
            required: false,
            description: '排序：desc/asc'
        }
     * #swagger.parameters['keyword'] = {
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
              "name": "員工弟弟",
              "content": "這家店草真的好帥",
              "tags": [
                "帥哥",
                "店草"
              ],
              "type": "person",
              "image": "",
              "user": {
                "_id": "6277b20ad980d4df45db6447",
                "name": "Johnny",
                "photo": ""
              },
              "likes": 0,
              "__v": 0
            }]
          }
        }
      }
     */
  PostsContollers.getPosts(req, res, next);
});
// 新增單一post
router.post('/', (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '新增單筆貼文 API'
     * #swagger.responses[200] = {
          description: '貼文資訊',
          schema: {
            "status": "success",
            "message": [{
              "_id": "6278b537c393fa2485a7eea4",
              "content": "這家店草真的好帥",
              "image": "",
              "user": {
                "_id": "6277b20ad980d4df45db6447",
                "name": "Johnny",
                "photo": ""
              },
            "likes": 0,
            "__v": 0
            }]
          }
        }
      }
     */
      PostsContollers.createPosts(req, res, next);
});
// 刪除全部posts
router.delete('/', (req, res, next) => {
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
router.delete('/:id', (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '刪除單筆貼文 API'
     * #swagger.responses[200] = {
      description: '貼文資訊',
        schema: {
          "status": "success",
          "message": {
          "_id": "627b143e88edb2f730f97feb",
          "name": "員工弟弟",
          "content": "這家店草真的好帥",
          "tags": [
            "帥哥",
            "店草"
          ],
          "type": "person",
          "image": "",
          "user": "6277b20ad980d4df45db6447",
          "likes": 0,
          "createdAt": "2022-05-11T01:41:18.681Z",
          "__v": 0
          }
        }
      }
     */
  PostsContollers.deleteOnePosts(req, res, next);
});
// 修改單一post
router.patch('/:id', (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     * #swagger.description = '修改單筆貼文 API'
     * #swagger.responses[200] = {
      description: '貼文資訊',
        schema: {
          "status": "success",
          "message": {
          "_id": "627b143e88edb2f730f97feb",
          "name": "員工弟弟",
          "content": "這家店草真的好帥",
          "tags": [
            "帥哥",
            "店草"
          ],
          "type": "person",
          "image": "",
          "user": "6277b20ad980d4df45db6447",
          "likes": 0,
          "createdAt": "2022-05-11T01:41:18.681Z",
          "__v": 0
          }
        }
      }
     */
  PostsContollers.updatePosts(req, res, next);
});

module.exports = router;
