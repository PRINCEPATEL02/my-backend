const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Path to image file
  graphImage: { type: String }, // Path to graph image file
  video: { type: String }, // Path to video file
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Add index on createdAt for faster sorting
PostSchema.index({ createdAt: -1 });


module.exports = mongoose.model("Post", PostSchema);
