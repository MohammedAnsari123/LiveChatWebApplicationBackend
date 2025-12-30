const express = require("express");
const { protectAdmin } = require("../middleware/adminAuthMiddleware");
const {
    registerAdmin,
    authAdmin,
    getStats,
    getAllUsers,
    deleteUser,
    getAllPosts,
    deletePost,
    getAllGroups
} = require("../controllers/adminController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", authAdmin);
router.get("/stats", protectAdmin, getStats);
router.get("/users", protectAdmin, getAllUsers);
router.delete("/users/:id", protectAdmin, deleteUser);

router.get("/posts", protectAdmin, getAllPosts);
router.delete("/posts/:id", protectAdmin, deletePost);

router.get("/groups", protectAdmin, getAllGroups);

module.exports = router;
