import Post from "../models_mongo/Post.js";
import Comment from "../models_mongo/Comment.js";
import PostLike from "../models_mongo/PostLike.js";
import db from "../models/index.js";
import { createNotification } from "./notification.controller.js";

const populateUserInfo = async (items, userIdField = "userId") => {
  const userIds = [...new Set(items.map((item) => item[userIdField]))];

  const users = await db.User.findAll({
    where: { userId: userIds },
    attributes: ["userId", "fullName", "avatarUrl"],
  });

  const userMap = users.reduce((acc, user) => {
    acc[user.userId] = user;
    return acc;
  }, {});

  return items.map((item) => {
    const itemObj = item.toObject ? item.toObject() : item;
    return {
      ...itemObj,
      user: userMap[item[userIdField]] || {
        fullName: "Unknown User",
        avatarUrl: null,
      },
    };
  });
};

export const createPost = async (req, res) => {
  try {
    const { content, imageUrls } = req.body;
    const userId = req.user.id;

    const newPost = await Post.create({ userId, content, imageUrls });

    const user = await db.User.findByPk(userId, {
      attributes: ["userId", "fullName", "avatarUrl"],
    });

    res.status(201).json({
      success: true,
      data: { ...newPost.toObject(), user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const postsWithUser = await populateUserInfo(posts);

    const postIds = posts.map((p) => p._id);
    const myLikes = await PostLike.find({
      userId: currentUserId,
      postId: { $in: postIds },
    });
    const likedPostIds = new Set(myLikes.map((l) => l.postId.toString()));

    const finalPosts = postsWithUser.map((post) => ({
      ...post,
      isLiked: likedPostIds.has(post._id.toString()),
    }));

    res.status(200).json({ success: true, data: finalPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const existingLike = await PostLike.findOne({ postId, userId });
    const post = await Post.findById(postId);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    let isLiked = false;

    if (existingLike) {
      await PostLike.deleteOne({ _id: existingLike._id });
      await Post.updateOne({ _id: postId }, { $inc: { likesCount: -1 } });
      isLiked = false;
    } else {
      await PostLike.create({ postId, userId });
      await Post.updateOne({ _id: postId }, { $inc: { likesCount: 1 } });
      isLiked = true;

      if (post.userId !== userId) {
        const liker = await db.User.findByPk(userId);
        await createNotification({
          recipientId: post.userId,
          senderId: userId,
          type: "LIKE",
          title: "Tương tác mới",
          message: `${liker.fullName} đã thích bài viết của bạn.`,
          metadata: { postId: post._id.toString() },
        });
      }
    }

    res.status(200).json({ success: true, isLiked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const newComment = await Comment.create({ postId, userId, content });

    await Post.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });

    const user = await db.User.findByPk(userId, {
      attributes: ["userId", "fullName", "avatarUrl"],
    });

    const post = await Post.findById(postId);
    if (post && post.userId !== userId) {
      await createNotification({
        recipientId: post.userId,
        senderId: userId,
        type: "COMMENT",
        title: "Bình luận mới",
        message: `${user.fullName} đã bình luận: "${content}"`,
        metadata: { postId: post._id.toString() },
      });
    }

    res.status(201).json({
      success: true,
      data: { ...newComment.toObject(), user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Lấy danh sách bình luận
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: 1 });

    const commentsWithUser = await populateUserInfo(comments);

    res.status(200).json({ success: true, data: commentsWithUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// social.controller.js
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user.userId;

    const post = await db.Post.findByPk(postId, {
      include: [
        { model: db.User, as: "author", attributes: ["fullName", "avatarUrl"] },
        {
          model: db.Comment,
          as: "comments",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["fullName", "avatarUrl"],
            },
          ],
          order: [["createdAt", "DESC"]], // Comment mới nhất lên đầu
        },
      ],
    });

    if (!post)
      return res.status(404).json({ success: false, message: "Not found" });

    const likeCount = await db.PostLike.count({ where: { postId } });
    const isLiked = await db.PostLike.findOne({
      where: { postId, userId: currentUserId },
    });

    res.status(200).json({
      success: true,
      data: {
        ...post.toJSON(),
        likeCount,
        isLiked: !!isLiked,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
