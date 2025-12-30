const Admin = require("../models/Admin");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Post = require("../models/Post");
const generateToken = require("../utils/generateToken");
const { getIO } = require("../socket/socket");

const registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password, pic, secretKey } = req.body;

        if (!name || !email || !password || !secretKey) {
            res.status(400);
            throw new Error("Please Enter all the Fields");
        }

        if (secretKey !== process.env.ADMIN_SECRET) {
            res.status(401);
            throw new Error("Invalid Admin Secret");
        }

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            res.status(400);
            throw new Error("Admin already exists");
        }

        const admin = await Admin.create({ name, email, password, pic });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                pic: admin.pic,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400);
            throw new Error("Failed to Create the Admin");
        }
    } catch (error) {
        next(error);
    }
};

const authAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                pic: admin.pic,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalChats = await Chat.countDocuments();
        const totalMessages = await Message.countDocuments();
        const totalPosts = await Post.countDocuments();

        // Get active users from Socket.IO
        const io = getIO();
        let activeUsers = 0;
        if (io) {
            activeUsers = io.engine.clientsCount;
        }

        const inactiveUsers = totalUsers - activeUsers;

        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalChats,
            totalMessages,
            totalPosts,
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword); // Find all users matching keyword
        res.send(users);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: "User removed" });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        next(error);
    }
};

const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({})
            .populate("user", "name pic email")
            .populate("comments.user", "name pic")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            await post.deleteOne();
            res.json({ message: "Post removed" });
        } else {
            res.status(404);
            throw new Error("Post not found");
        }
    } catch (error) {
        next(error);
    }
};

const getAllGroups = async (req, res, next) => {
    try {
        const groups = await Chat.find({ isGroupChat: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .sort({ updatedAt: -1 });
        res.json(groups);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerAdmin,
    authAdmin,
    getStats,
    getAllUsers,
    deleteUser,
    getAllPosts,
    deletePost,
    getAllGroups
};
