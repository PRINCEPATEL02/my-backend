const mongoose = require("mongoose");
const Post = require("./models/Post");
const config = require("./config");

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing posts
    await Post.deleteMany({});
    console.log("🗑️  Cleared existing posts");

    // Add sample posts
    const samplePosts = [
      {
        title: "AI-Powered Learning Platform",
        description:
          "An intelligent platform that adapts to each student's learning style and pace, providing personalized education experiences.",
        email: "john@example.com",
        likeCount: 5,
      },
      {
        title: "Sustainable Food Delivery",
        description:
          "A zero-waste food delivery service using reusable containers and electric vehicles to reduce environmental impact.",
        email: "jane@example.com",
        likeCount: 3,
      },
      {
        title: "Smart Home Security System",
        description:
          "An AI-powered home security system that learns your habits and provides intelligent monitoring and alerts.",
        email: "mike@example.com",
        likeCount: 7,
      },
    ];

    const savedPosts = await Post.insertMany(samplePosts);
    console.log(`✅ Added ${savedPosts.length} sample posts`);

    // Fetch and display posts
    const allPosts = await Post.find().sort({ createdAt: -1 });
    console.log("\n📝 Current posts in database:");
    allPosts.forEach((post, index) => {
      console.log(
        `${index + 1}. ${post.title} (by ${post.email}) - ${
          post.likeCount
        } likes`
      );
    });

    console.log("\n🎉 Database test completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  }
}

testDatabase();
