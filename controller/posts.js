const Post = require('../models/postsModel');
const { errorHandle, successHandle } = require('../service/responseHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');

const posts = {
  async getPosts(req, res) {
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
  },
  createPosts: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const { content, image } = req.body;
      if (content) {
        const newPost = await Post.create({
          content,
          user,
          image,
        });
        successHandle(res, newPost);
      } else {
        appError(400, '新增失敗，內容必須填寫', next);
      }
  }),
  deleteAllPosts: handleErrorAsync(async (req, res, next) => {
    if (req.originalUrl !== '/posts/') {
      const post = await Post.deleteMany({});
      successHandle(res, post);
    } else {
      appError(404, '刪除失敗，無此網站路由', next);
    }
  }),
  deleteOnePosts: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    if (post !== null) {
      // post = null 查不到貼文id
      successHandle(res, post);
    } else {
      appError(400, '刪除失敗，無此貼文ID', next);
    }
  }),
  updatePosts: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const { user, content, likes, image } = req.body;
    if (content) {
      const post = await Post.findByIdAndUpdate(
        id,
        {
          $set: {
            content,
            user,
            likes,
            image,
          },
        },
        { 
          new: true,
          runValidators: true,
        }
      );
      if (post !== null) {
        // post = null 查不到貼文id
        successHandle(res, post);
      } else {
        appError(400, '更新失敗，無此貼文ID或格式填寫錯誤', next);
      }
    } else {
      appError(400, '更新失敗，未輸入必填貼文內容', next);
    }
  }),
};

module.exports = posts;
