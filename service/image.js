const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
    cb(null, true);
  },
}).single('image');

module.exports = upload;