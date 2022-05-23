const { ImgurClient } = require('imgur');
const sizeOf = require('image-size')
const { errorHandle, successHandle } = require('../service/responseHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'));
    }
    cb(null, true);
  },
}).single('image');

const files = {
  createImage: handleErrorAsync(async (req, res, next) => {
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    if (!req.file) {
      return appError(400, '無選取檔案', next);
    }
    const dimensions = sizeOf(req.file.buffer);
    if(dimensions.width !== dimensions.height) {
      return next(appError(400,"圖片長寬不符合 1:1 尺寸。",next))
    }
      const imageFile = req.file;
      const response = await client.upload({
        image: Buffer.from(imageFile.buffer).toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID
      });
      successHandle(res, { link: response.data.link });
  }),
};

module.exports = {
  files,
  upload,
};
