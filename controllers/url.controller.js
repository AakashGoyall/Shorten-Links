const Url = require("../models/urlSchema");
const crypto = require("crypto");
require("dotenv").config();
const moment = require("moment");


const getIndexPage = async (req, res) => {
  try {
    const userData = req.user || null;
    let data = [];
    const hostName = process.env.HOST_NAME || `${req.protocol}://${req.get("host")}`;

    if (!userData || !userData.id) {
      return res.render('index', { data: [], hostName, moment });
    }

    const userId = userData.id;

    data = await Url.find({ userId });

    res.render("index", { data, hostName, moment });

  } catch (error) {
    console.error("Error loading index page:", error);
    res.status(500).send("Server Error");
  }
};

const addUrl = async (req, res) => {
  let { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(404).send("Unavailable url");
  }

  let shortenUrl = crypto.randomBytes(4).toString("hex");

  const isExist = await Url.findOne({ shortenUrl });

  if (isExist) {
    shortenUrl = crypto.randomBytes(4).toString("hex");
  }
  
  const hostNameURL = new URL(originalUrl).hostname.split(".");
  const siteName = hostNameURL.length > 2 ? hostNameURL[1] : hostNameURL[0];
  const userId = req.user?.id

  try {
    await Url.create({ shortenUrl, url: originalUrl, siteName, userId });
    return res.status(200).send("Successfully Added the data");
  } catch (error) {
    console.log("Post home error", error);
  }
};

const updateUrl = async (req, res) => {
  const { id } = req.params;
  const { shortenUrl } = req.body;

  const isExist = await Url.findOne({shortenUrl})

  if(isExist){
    return res.status(404).send("Use another name because this is already exist")
  }

  try {
    await Url.updateOne(
      { _id: id }, 
      { $set: { shortenUrl: shortenUrl } }
    );
    return res.status(200).send("Updated successfully");
  } catch (error) {
    console.error("something error in update post");
  }
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Url.findByIdAndDelete(id);

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
  const data = await Url.findOne({ shortenUrl });

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

module.exports = { getIndexPage, addUrl, redirectedPage, deleteUrl, updateUrl};
