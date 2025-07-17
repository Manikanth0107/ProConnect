import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  delete_comment_of_user,
  deletePost,
  get_comments_by_post,
  getAllPosts,
  increment_likes,
} from "../controllers/posts.contoller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.route("/").get(activeCheck);

router.route("/post").post(upload.single("media"), createPost);

router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);

export default router;
