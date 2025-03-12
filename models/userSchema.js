const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require('dotenv').config()

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: Number,
      minLength: 10,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hashing the password
userSchema.pre("save", async function (next) {
  try {
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
    next();
  } catch (error) {
    console.error(error);
  }
});

// compare the password
userSchema.methods.comparePassword = async function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("ComparePassword",error);
  }
};


const User = new mongoose.model("user", userSchema);

module.exports = User;
