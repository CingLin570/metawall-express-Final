const express = require('express');
const router = express.Router();
const files= require('../controller/files');
const upload = require('../service/image')
const { checkAuth } = require('../service/auth');

router.post('/file', checkAuth, upload, (req, res, next) => {
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
     * #swagger.parameters['name'] = {
            in: 'formData',
            name: 'name',
            type: 'string',
            required: false,
            description: '限制圖片比例判斷'
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
