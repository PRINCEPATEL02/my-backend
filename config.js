module.exports = {
 
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://Princesp02:Princesp02@cluster0.tykleyq.mongodb.net/pitchboard?retryWrites=true&w=majority",

  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "",
};
