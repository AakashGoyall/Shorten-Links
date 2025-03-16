const express = require("express");
const {
  signupPage,
  checkUser,
  postSignup,
  showForgetPage,
  loginPage,
  postLogin,
  updatePassword,
  signupOTP,
  forgetOTP,
  checkLogin
} = require("../controllers/auth.controller");

const router = express.Router();

router.route("/userLoggedIn").get(checkLogin);
router.route("/forget").get(showForgetPage).post(checkUser).patch(updatePassword)
router.route('/forgetOTP').post(forgetOTP)
router.route("/login").get(loginPage).post(postLogin);
router.route("/signup").get(signupPage).post(postSignup);
router.route('/signupOTP').post(signupOTP)

const authRouter = router;
module.exports = authRouter;
