const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createPost, getPosts, likePost, addComment } = require("../controllers/postController");

const router = express.Router();

router.route("/").post(protect, createPost).get(protect, getPosts);
router.route("/:id/like").put(protect, likePost);
router.route("/:id/comment").post(protect, addComment);

module.exports = router;
