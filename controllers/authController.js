const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, pic, secretKey } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter all the Fields");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        let isAdmin = false;
        if (secretKey && secretKey === process.env.ADMIN_SECRET) {
            isAdmin = true;
        }

        const user = await User.create({ name, email, password, pic, isAdmin });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("Failed to Create the User");
        }
    } catch (error) {
        next(error);
    }
};

const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    console.log("updateUserProfile request received");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.pic = req.body.pic || user.pic;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                pic: updatedUser.pic,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error("User Not Found");
        }
    } catch (error) {
        console.error("updateUserProfile Error:", error);
        next(error);
    }
};

const allUsers = async (req, res, next) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        res.send(users);
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, authUser, updateUserProfile, allUsers };
