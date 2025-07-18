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
  JWT_SECRET: process.env.JWT_SECRET || "9e65643cc8258d9ea56338a1ef8a721a93fbc4b3a83ccdd19c46b99eb56ee193a5977dc37a6cf25b1178d157a1a1f812b044240215839ba83245c00ae0f64fb5",
};
