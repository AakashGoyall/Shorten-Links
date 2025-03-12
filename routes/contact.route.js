const express = require("express");
const { getContactPage, postContactPage } = require("../controllers/contact.controller");
const router = express.Router();

router.route('/').get(getContactPage).post(postContactPage)

const contactRouter = router

module.exports = contactRouter;