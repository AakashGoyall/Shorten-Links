const Contact = require("../models/contactSchema");

const getContactPage = (req, res) => {
  res.render("contact");
};

const postContactPage = async (req, res) => {
  const { username, email, message } = req.body;

  try {
    const data = await Contact.create({ username, email, message });

    if (!data) {
      return res.status(400).json({msg: "Please try again!"})
    }
    return res.status(200).json({msg: "Successfully data sent"})
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg: "Something server error"})
  }
};

module.exports = { getContactPage, postContactPage };
