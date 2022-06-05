const Post = require('../models/postsModel');
const { successHandle } = require('../service/responseHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');

const posts = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await Post.find(q)
      .populate({
        path: 'user',
        select: 'name photo ',
      })
      .sort(timeSort);
    successHandle(res, post);
  }),
  createPosts: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const { content, image } = req.body;
    if (!content) {
      return appError(400, '新增失敗，內容必須填寫', next);
    }
    const newPost = await Post.create({
      content,
      user,
      image,
    });
    successHandle(res, newPost);
  }),
  deleteAllPosts: handleErrorAsync(async (req, res, next) => {
    if (req.originalUrl !== '/posts/') {
      return appError(404, '刪除失敗，無此網站路由', next);
    }
    const post = await Post.deleteMany({});
    successHandle(res, post);
  }),
  deleteOnePosts: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      // post = null 查不到貼文id
      return appError(400, '刪除失敗，無此貼文ID', next);
    }
    successHandle(res, post);
  }),
  updatePosts: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const { content, likes, image } = req.body;
    if (!content) {
      return appError(400, '更新失敗，未輸入必填貼文內容', next);
    } 
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          content,
          likes,
          image,
        },
      },
      { 
        new: true,
        runValidators: true,
      }
    );
    if (!post) {
      // post = null 查不到貼文id
      return appError(400, '更新失敗，無此貼文ID或格式填寫錯誤', next);
    }
    successHandle(res, post);
  }),
};

module.exports = posts;
