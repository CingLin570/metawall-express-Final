const { ImgurClient } = require('imgur');
const client = new ImgurClient({ accessToken: process.env.IMGUR_ACCESS_TOKEN })
const { errorHandle, successHandle } = require("../service/responseHandler");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
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

const files = {
  createImage: handleErrorAsync(async (req, res, next) => {
    if (!req.file) {
      appError(400, "無選取檔案", next);
    } else {
      const imageFile = req.file;
      const response = await client.upload({
        image: Buffer.from(imageFile.buffer).toString('base64'),
        type: 'base64',
      })
      successHandle(res, { link: response.data.link });
    }
  })
}

module.exports = {
  files,
  upload
};