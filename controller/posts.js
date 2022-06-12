const Post = require('../models/postsModel');
const Comment = require('../models/commentsModel');
const { successHandle } = require('../service/responseHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const checkMongoObjectId = require('../service/checkMongoObjectId');

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
    const postId = req.params.id;
    if(!checkMongoObjectId(postId)) {
      return appError(400, '取得失敗，請輸入正確的ID格式', next);
    }
    const post = await Post.findById(postId)
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
    const userId = req.params.id;
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
      const data = {
        user: userId,
        q
      }
      if(!checkMongoObjectId(userId)) {
        return appError(400, '取得失敗，請輸入正確的ID格式', next);
      }
    const posts = await Post.find(data).populate({
      path: 'user',
      select: 'name photo ',
    }).populate({
      path: 'comments',
      options: { sort: '-createdAt' }
    })
    .sort(timeSort);
    successHandle(res, posts);
  }),
  createPost: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { content, image } = req.body;
      if (!content) {
        return appError(400, '新增失敗，內容必須填寫', next);
      }
      const newPost = await Post.create({
        content,
        user: userId,
        image,
      });
      successHandle(res, newPost);
  }),
  deleteOnePost: handleErrorAsync(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    if(!checkMongoObjectId(postId)) {
      return appError(400, '取得失敗，請輸入正確的ID格式', next);
    }
    const findPost = await Post.findById(postId);
    if (!findPost) {
      return appError(400, "刪除失敗，查無此貼文ID", next);
    }
    if (findPost.user.toString() !== userId) {
      return appError(401, "您沒有刪除此貼文權限", next);
    }
    const post = await Post.findByIdAndDelete(postId);
    successHandle(res, post);
  }),
  updatePost: handleErrorAsync(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content, image } = req.body;
    if(!checkMongoObjectId(postId)) {
      return appError(400, '更新失敗，請輸入正確的ID格式', next);
    }
    if (!content) {
      return appError(400, '更新失敗，未輸入必填貼文內容', next);
    }
    const findPost = await Post.findById(postId);
    if (!findPost) {
      return appError(400, "刪除失敗，查無此貼文ID", next);
    }
    if (findPost.user.toString() !== userId) {
      return appError(401, "您沒有刪除此貼文權限", next);
    }
    const post = await Post.findByIdAndUpdate(
      postId,
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
    successHandle(res, post);
  }),
  createLike: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const postId = req.params.id;
    if(!checkMongoObjectId(postId)) {
      return appError(400, '新增失敗，請輸入正確的ID格式', next);
    }
    const post = await Post.findByIdAndUpdate(
      postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    // 查不到貼文id
    if(!post) {
      return appError(400, '新增失敗，無此貼文ID或格式填寫錯誤', next);
    }
    successHandle(res, post);
  }),
  deleteLike: handleErrorAsync(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    if(!checkMongoObjectId(postId)) {
      return appError(400, '刪除失敗，請輸入正確的ID格式', next);
    }
    const post = await Post.findByIdAndUpdate(
      postId,
        { $pull: { likes: userId } },
        { new: true }
      );
    // 查不到貼文id
    if(!post) {
      return appError(400, '刪除失敗，無此貼文ID或格式填寫錯誤', next);
    }
    successHandle(res, post);
  }),
  createComment: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const postId = req.params.id;
    const {comment} = req.body;
    if(!checkMongoObjectId(postId)) {
      return appError(400, '新增失敗，請輸入正確的ID格式', next);
    }
    if(!comment) {
      return appError(400, '新增失敗，未輸入必填留言內容', next);
    }
    const findPost = await Post.findById(postId);
    if(!findPost) {
      return appError(400, '新增失敗，查無此貼文ID', next);
    }
    const newComment = await Comment.create({
      post: postId,
      user: userId,
      comment
    });
    successHandle(res, newComment);
  })
};

module.exports = posts;
