var express = require('express');
var router = express.Router();
const FilesContollers = require("../controller/files");
const multer  = require('multer');
const upload = multer({
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'))
    }
    cb(null, true)
  }
});

router.post('/', upload.single('image'), (req, res, next) => {
    /**
     * #swagger.tags = ['Files - 圖片上傳']
     * #swagger.description = '圖片上傳 API'
     * #swagger.responses[200] = {
          description: '貼文資訊',
          schema: {
            "status": "success",
            "message": {
              "link": "https://i.imgur.com/123.png"
            }
          }
        }
      }
     */
    FilesContollers.createImage(req, res, next);
});

module.exports = router;