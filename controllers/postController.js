const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res, next) => {
    try {
        const { content, image } = req.body;

        if (!content && !image) {
            res.status(400);
            throw new Error("Post must have content or image");
        }

        const newPost = await Post.create({
            user: req.user._id,
            content,
            image,
        });

        const fullPost = await Post.findById(newPost._id).populate("user", "name pic");
        res.status(201).json(fullPost);
    } catch (error) {
        next(error);
    }
};

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate("user", "name pic")
            .populate("comments.user", "name pic")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        next(error);
    }
};

const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }

        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        next(error);
    }
};

const addComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }

        const comment = {
            user: req.user._id,
            text,
        };

        post.comments.push(comment);
        await post.save();

        const fullPost = await Post.findById(req.params.id)
            .populate("user", "name pic")
            .populate("comments.user", "name pic");

        res.json(fullPost);
    } catch (error) {
        next(error);
    }
};

module.exports = { createPost, getPosts, likePost, addComment };
