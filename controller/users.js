const User = require("../models/usersModel");
const { errorHandle, successHandle } = require("../service/responseHandler");

const users = {
  async getUsers(req, res) {
    const user = await User.find();
    successHandle(res, user);
  }
}

module.exports = users;