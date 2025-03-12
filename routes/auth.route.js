const express = require("express");
const {
  signupPage,
  postSignup,
  loginPage,
  postLogin,
  verifyOTP,
  checkLogin
} = require("../controllers/auth.controller");

const router = express.Router();

router.route("/userLoggedIn").get(checkLogin);
router.route("/login").get(loginPage).post(postLogin);
router.route("/signup").get(signupPage).post(postSignup);
router.route('/verifyOTP').post(verifyOTP)

const authRouter = router;
module.exports = authRouter;
