const Post = require('../models/postsModel');
const Comment = require('../models/commentsModel');
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
        path: 'user', // 關聯到user model
        select: 'name photo ', // 只取出關聯user的特定欄位
      }).populate({
        path: 'comments',
        options: { sort: '-createdAt' }
      })
      .sort(timeSort);
    successHandle(res, post);
  }),
  getSinglePost: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findById(id)
    .populate({
      path: 'user', // 關聯到user model
      select: 'name photo ', // 只取出關聯user的特定欄位
    }).populate({
      path: 'comments',
      options: { sort: '-createdAt' }
    })
    // 查不到貼文id
    if(!post) {
      return appError(400, '查詢失敗，無此貼文ID或格式填寫錯誤', next);
    }
    successHandle(res, post);
  }),
  getOwnPosts: handleErrorAsync(async (req, res, next) => {
    const user = req.params.id;
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
      const data = {
        user,
        q
      }
    const posts = await Post.find(data).populate({
      path: 'user',
      select: 'name photo ',
    }).populate({
      path: 'comments',
      select: 'comment user'
    })
    .sort(timeSort);
    successHandle(res, posts);
  }),
  createPost: handleErrorAsync(async (req, res, next) => {
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
  deleteOnePost: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    // 查不到貼文id
    if (!post) {
      return appError(400, '刪除失敗，無此貼文ID', next);
    }
    successHandle(res, post);
  }),
  updatePost: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const { content, image } = req.body;
    if (content) {
      const post = await Post.findByIdAndUpdate(
        id,
        {
          $set: {
            content,
            image,
          },
        },
        { 
          new: true,
          runValidators: true,
        }
      );
      // 查不到貼文id
      if (!post) {
        return appError(400, '更新失敗，無此貼文ID或格式填寫錯誤', next);
      }
      successHandle(res, post);
    } else {
      appError(400, '更新失敗，未輸入必填貼文內容', next);
    }
  }),
  createLike: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findByIdAndUpdate(
        id,
        { $addToSet: { likes: req.user.id } },
        { new: true }
      );
    // 查不到貼文id
    if(!post) {
      return appError(400, '新增失敗，無此貼文ID或格式填寫錯誤', next);
    }
    successHandle(res, post);
  }),
  deleteLike: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user.id } },
        { new: true }
      );
    // 查不到貼文id
    if(!post) {
      return appError(400, '刪除失敗，無此貼文ID或格式填寫錯誤', next);
    }
    successHandle(res, post);
  }),
  createComment: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const post = req.params.id;
    const {comment} = req.body;
    if(!comment) {
      return appError(400, '新增失敗，未輸入必填留言內容', next);
    }
    const findPost = await Post.findById(post);
    if(!findPost) {
      return appError(400, '新增失敗，查無此貼文ID', next);
    }
    const newComment = await Comment.create({
      post,
      user,
      comment
    });
    successHandle(res, newComment);
  })
};

module.exports = posts;
