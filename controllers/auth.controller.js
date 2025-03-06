const User = require("../models/userSchema");
const crypto = require("crypto");
require("dotenv").config();
const moment = require("moment");
const os = require("os")


const getPost = async (req, res) => {
  const hostName = process.env.HOST_NAME || `${req.protocol}://${req.get("host")}`;
  const data = await User.find();

  return res.render("index", { data, hostName, moment });
};

const addPost = async (req, res) => {
  let { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(404).send("Unavailable url");
  }

  const hostNameURL = new URL(originalUrl).hostname.split(".");
  const siteName = hostNameURL.length > 2 ? hostNameURL[1] : hostNameURL[0];

  let shortenUrl = crypto.randomBytes(4).toString("hex");

  const isExist = await User.findOne({ shortenUrl });

  if (isExist) {
    shortenUrl = crypto.randomBytes(4).toString("hex");
  }

  try {
    await User.create({ shortenUrl, url: originalUrl, siteName });
    return res.status(200).send("Successfully Added the data");
  } catch (error) {
    console.log("Post home error", error);
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { shortenUrl } = req.body;

  const isExist = await User.findOne({shortenUrl})

  if(isExist){
    return res.status(404).send("Use another name because this is already exist")
  }

  try {
    await User.updateOne(
      { _id: id }, 
      { $set: { shortenUrl: shortenUrl } }
    );
    return res.status(200).send("Updated successfully");
  } catch (error) {
    console.error("something error in update post");
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: "something error" });
    }

    return res.status(200).json({ msg: "Post successfully deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "there is server error" });
  }
};

const redirectedPage = async (req, res) => {
  const { shortenUrl } = req.params;
  const data = await User.findOne({ shortenUrl });

  try {
    if (data) {
      return res.status(300).redirect(data.url);
    }

    return res.status(404).render("error");
  } catch (error) {
    console.log("this is server error", error);
    return res.statuss(500).send("server error");
  }
};

module.exports = { getPost, addPost, redirectedPage, deletePost, updatePost };
