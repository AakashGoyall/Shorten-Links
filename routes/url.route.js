const express = require("express")
const router = express.Router();
const jwt = require('jsonwebtoken')
const {verifyToken, verifyPost} = require("../middleware/verifyUser.middleware")
const { getIndexPage, addUrl, redirectedPage,deleteUrl, updateUrl } = require("../controllers/url.controller");

router.route('/').get(verifyPost, getIndexPage).post(verifyToken, addUrl)
router.route('/:id').patch(updateUrl).delete(deleteUrl)
router.route('/terms').get((req, res)=>{
    res.render('terms')
})
router.route("/:shortenUrl").get(redirectedPage)


const urlRouter = router
module.exports = urlRouter