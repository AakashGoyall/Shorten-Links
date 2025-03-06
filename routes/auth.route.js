const express = require("express");
const { getPost, addPost, redirectedPage,deletePost, updatePost } = require("../controllers/auth.controller");

const router = express.Router()

router.route("/").get(getPost)
router.route("/:shortenUrl").get(redirectedPage)
router.route("/update/:id").patch(updatePost)
router.route("/submit").post(addPost)
router.route("/delete/:id").delete(deletePost)



module.exports = router