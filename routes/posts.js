const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all posts...");
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`Found ${posts.length} posts`);
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Creating new post...");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { title, description, email } = req.body;
    
    if (!title || !description || !email) {
      console.log("Missing required fields:", { title: !!title, description: !!description, email: !!email });
      return res
        .status(400)
        .json({ error: "Title, description, and email are required" });
    }

    const postData = {
      title: title.trim(),
      description: description.trim(),
      email: email.trim(),
      image: req.file ? req.file.path : null,
    };

    console.log("Post data to save:", postData);

    const post = new Post(postData);
    const savedPost = await post.save();
    
    console.log("Post saved successfully:", savedPost);
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: err.message });
  }
});

// Like a post
router.post("/like/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likeCount: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ likeCount: post.likeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
