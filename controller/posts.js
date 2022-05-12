const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const { errorHandle, successHandle } = require("../service/responseHandler");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

const posts = {
  async getPosts(req, res) {
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const post = await Post.find(q).populate({
        path: 'user',
        select: 'name photo '
      }).sort(timeSort);
    successHandle(res, post);
  },
  createPosts: handleErrorAsync(async (req, res, next) => {
    let { user, name, content, type, tags } = req.body;
    if(content || name) {
      const findUser = await User.findById(user).exec();
      if(findUser) {
        const newPost = await Post.create({
          name,
          content,
          user,
          type,
          tags,
        });
        successHandle(res, newPost);
      } else {
        appError(400, "新增失敗，無此使用者ID", next);
      }
    } else {
      appError(400, "新增失敗，必填項目 content 或 name 沒有填寫資料", next);
    }
  }),
  deleteAllPosts: handleErrorAsync(async(req, res, next) => {
    if(req.originalUrl !== '/posts/'){
      const post = await Post.deleteMany({});
      successHandle(res, post);
    } else {
      appError(404, "刪除失敗，無此網站路由", next);
    }
  }),
  deleteOnePosts: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    if(post !== null) { // post = null 查不到id
      successHandle(res, post);
    } else {
      appError(400, "刪除失敗，無此使用者ID", next);
    }
  }),
  updatePosts: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    let { content, image, likes, type, tags } = req.body;
    if(content) {
      const post = await Post.findByIdAndUpdate(id, {
        $set: {
          content,
          image,
          likes,
          type,
          tags
        },  
      },
      { new: true });
      if(post !== null) { // post = null 查不到id
        successHandle(res, post);
      } else {
        appError(400, "更新失敗，無此使用者id或格式填寫錯誤", next);
      }
    } else {
      appError(400, "更新失敗，未輸入必填貼文內容", next);
    }
  })
};

module.exports = posts;