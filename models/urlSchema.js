const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema(
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
      userId: {
        type: String,
        default: 5
      },
      createdAt: {
          type: Date,
          default: Date.now
      }
    },
  );

const Url = new mongoose.model("url", urlSchema)

module.exports = Url;