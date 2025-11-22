import express from "express";
import {
  createPost,
  getPosts,
  createComment,
  toggleLikePost,
  getPostById,
} from "../controllers/social.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/posts", verifyToken, createPost);
router.get("/posts", verifyToken, getPosts);
router.post("/posts/:postId/like", verifyToken, toggleLikePost);
router.post("/posts/:postId/comments", verifyToken, createComment);
router.get("/posts/:postId", verifyToken, getPostById);

export default router;
