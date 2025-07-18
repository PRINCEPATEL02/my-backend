const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const path = require("path");
const config = require("./config");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);

// MongoDB connection
mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "PitchBoard API is running!" });
});

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
