const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, trim: true },
        image: { type: String }, // URL from Cloudinary
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
