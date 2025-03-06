const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
      shortenUrl: {
        type: String,
        required: true,
        unique: true,
      },
      url: {
        type: String,
      },
      siteName: {
        type: String,
        required: true,
      },
      createdAt: {
          type: Date,
          default: Date.now
      }
    },
  );

const User = new mongoose.model("User", userSchema)

module.exports = User;