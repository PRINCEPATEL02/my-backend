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
      console.log("Missing required fields:", {
        title: !!title,
        description: !!description,
        email: !!email,
      });
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

// Toggle like/unlike a post
router.post("/:id/like", async (req, res) => {
  try {
    // Assume user is authenticated and user ID is available as req.user.id
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(userId);

    if (liked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
