const express = require("express");
const { upload } = require("../config/cloudinary");
const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Cloudinary returns the path in req.file.path
        res.json({
            url: req.file.path,
            message: "File uploaded successfully",
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Server Upload Failed" });
    }
});

module.exports = router;
