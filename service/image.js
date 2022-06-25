const multer = require('multer');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');

const uploadFile = handleErrorAsync(async (req, res, next) => {
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
  upload(req, res, (err) => {
    if(err instanceof multer.MulterError) {
      return appError(400, '上傳失敗，圖片檔案必須小於1MB', next);
    } else if(err) {
      return appError(400, err, next);
    }
    next();
  })
})

module.exports = uploadFile;