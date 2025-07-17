module.exports = {
  // MongoDB Atlas Connection String
  // Replace this with your MongoDB Atlas connection string
  // MONGO_URI:
  //   process.env.MONGO_URI ||
  //   "mongodb+srv://Princesp02:Princesp02@cluster0.tykleyq.mongodb.net/pitchboard?retryWrites=true&w=majority",

  // For local MongoDB Compass (uncomment to use local database)
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://Princesp02:Princesp02@cluster0.tykleyq.mongodb.net/pitchboard?retryWrites=true&w=majority",

  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
};
