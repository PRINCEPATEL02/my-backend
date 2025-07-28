const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");
const ImageKit = require("imagekit");
require("dotenv").config();
const auth = require("../middleware/auth");

// Configure multer for file uploads
const storage = multer.memoryStorage();

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

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
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

    let imageUrl = null;
    let imagekitResponse = null;

    if (req.file) {
      try {
        // Upload image buffer to ImageKit
        imagekitResponse = await imagekit.upload({
          file: req.file.buffer.toString("base64"), // base64 encoded image
          fileName: Date.now() + path.extname(req.file.originalname),
        });
        imageUrl = imagekitResponse.url;
      } catch (uploadError) {
        console.error("Error uploading image to ImageKit:", uploadError);
        return res.status(500).json({ error: "Failed to upload image to ImageKit" });
      }
    }

    const postData = {
      title: title.trim(),
      description: description.trim(),
      email: email.trim(),
      image: imageUrl,
    };

    console.log("Post data to save:", postData);

    const post = new Post(postData);
    const savedPost = await post.save();

    console.log("Post saved successfully:", savedPost);
    res.status(201).json({
      post: savedPost,
      imagekit: imagekitResponse,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: err.message });
  }
});

// Like or unlike a post (toggle)
router.post("/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming auth middleware sets req.user

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Initialize likes array if not present
    if (!post.likes) {
      post.likes = [];
    }

    const index = post.likes.indexOf(userId);
    let liked;
    if (index === -1) {
      // User has not liked the post, add like
      post.likes.push(userId);
      liked = true;
    } else {
      // User already liked the post, remove like
      post.likes.splice(index, 1);
      liked = false;
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      liked: liked,
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
