const errorContent = {
  400: {
    40001: 'id不存在',
    40002: '必填項目未填寫正確',
    40003: '貼文內容不能為空白',
    40004: '欄位資料錯誤',
  },
}

const errorHandle = (res, status, errorCode) => {
  let errorMessage = "";
  if (status) errorMessage = errorContent[status];
  if (status && errorCode)
    errorMessage = errorContent[status][errorCode];

    res.status(status).json({
      "status": "false",
      "message": errorMessage
    });
}
const successHandle = (res, data) => {
  res.status(200).json({
    "status": "success",
    "message": data
  });
}
module.exports = {
  errorHandle,
  successHandle
}