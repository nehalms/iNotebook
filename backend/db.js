const mongoose = require("mongoose");

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ifjjiuu.mongodb.net/inotebook?retryWrites=true&w=majority&appName=Cluster0`;

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 3,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB (pooled connection)");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};


module.exports = connectToMongo;