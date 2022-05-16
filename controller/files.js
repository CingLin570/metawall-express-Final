const { ImgurClient } = require('imgur');
const client = new ImgurClient({ accessToken: process.env.IMGUR_ACCESS_TOKEN })
const { errorHandle, successHandle } = require("../service/responseHandler");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

const files = {
  createImage: handleErrorAsync(async (req, res, next) => {
    console.log(client);
    if (!req.file) {
      appError(400, "無選取檔案", next);
    } else {
      const imageFile = req.file;
      try {
        const response = await client.upload({
          image: Buffer.from(imageFile.buffer).toString('base64'),
          type: 'base64',
        })
        successHandle(res, { link: response.data.link });
      } catch (error) {
        appError(400, error, next);
      }
    }
  })
}

module.exports = files;