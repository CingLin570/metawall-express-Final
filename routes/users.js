var express = require('express');
var router = express.Router();
const UsersContollers = require("../controller/users");

// 取得使用者
router.get('/', (req, res, next) => {
    /**
   * #swagger.tags = ['Users - 使用者']
   * #swagger.description = '取得全部使用者 API'
   * #swagger.responses[200] = {
          description: 'user 資訊',
          schema: {
              status: 'success',
              message: [{
                  _id: '6277b20ad980d4df45db6447',
                  name: 'Johnny',
                  photo: '123.png'
              }]
          }
      }
   */
    UsersContollers.getUsers(req, res, next);
});

router.get('/login', function(req, res, next) {
    /**
   * #swagger.ignore = true
   */
  res.status(200).json({
    "name":"login"
  })
});

module.exports = router;
