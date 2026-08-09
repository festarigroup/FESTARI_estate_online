import { Router } from "express";
import { protect } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { createUploadMiddleware } from "#app/middlewares/uploadMedia.js";
import { createStorySchema } from "#app/validators/storyValidators.js";
import { addCommentSchema, createPostSchema, updatePostSchema } from "#app/validators/postValidators.js";
import {
  listStories,
  getStory,
  createStory,
  deleteStory,
  viewStory,
} from "#app/controllers/storiesController.js";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  likePost,
  unlikePost,
  listComments,
  addComment,
  deleteComment,
  sharePost,
  savePost,
  unsavePost,
  listSavedPosts,
} from "#app/controllers/postsController.js";

const router = Router();
const uploadStoryMedia = createUploadMiddleware({ fieldName: "media", allowVideo: true, maxSizeMb: 20 });
const uploadPostImageMiddleware = createUploadMiddleware({ fieldName: "image" });

router.get("/posts", listPosts);
router.get("/posts/:id", getPost);
router.get("/posts/:id/comments", listComments);
router.get("/stories", listStories);
router.get("/stories/:id", getStory);

router.use(protect);

router.get("/saved", listSavedPosts);

router.post("/stories", uploadStoryMedia, validateSchema(createStorySchema), createStory);
router.delete("/stories/:id", deleteStory);
router.post("/stories/:id/view", viewStory);

router.post("/posts", validateSchema(createPostSchema), createPost);
router.put("/posts/:id", validateSchema(updatePostSchema), updatePost);
router.delete("/posts/:id", deletePost);
router.post("/posts/:id/images", uploadPostImageMiddleware, uploadPostImage);
router.post("/posts/:id/like", likePost);
router.delete("/posts/:id/like", unlikePost);
router.post("/posts/:id/comments", validateSchema(addCommentSchema), addComment);
router.delete("/comments/:id", deleteComment);
router.post("/posts/:id/share", sharePost);
router.post("/posts/:id/save", savePost);
router.delete("/posts/:id/save", unsavePost);

export default router;
