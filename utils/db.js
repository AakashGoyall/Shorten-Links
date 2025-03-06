require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("database connect successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


module.exports = connectDb
