var express = require('express');
var router = express.Router();
const { files, upload } = require('../controller/files');
const { checkAuth, generateSendJWT } = require('../service/auth');

router.post('/', checkAuth, upload, (req, res, next) => {
  /**
     * #swagger.tags = ['Files - 圖片上傳']
     * #swagger.parameters['Authorization'] = {
        in: 'header',
        type: 'string',
        required: true,
        description: 'Bearer token'
      }
     * #swagger.parameters['body'] = {
            in: 'formData',
            name: 'image',
            type: 'file',
            required: true,
            description: '資料格式'
        }
     * #swagger.description = '圖片上傳 API'
     * #swagger.responses[200] = {
          description: '貼文資訊',
          schema: {
            status: 'success',
            message: {
              link: 'https://i.imgur.com/123.png'
            }
          }
        }
      }
     */
  files.createImage(req, res, next);
});

module.exports = router;
