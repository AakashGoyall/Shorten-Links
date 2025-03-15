const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const sendOTP = require("../utils/sendOTP");
require("dotenv").config();

let otpStore = {};

const signupPage = (req, res) => {
  res.render("signup");
};

const postSignup = async (req, res) => {
  const { email } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ msg: "This user is already exist!" });
    }
    const otp = await sendOTP(email);
    otpStore[email] = {
      originalOTP: otp,
      otpExpiration: Date.now() + 1000 * 60 * 5,
    };

    console.log(otp);
    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.log("error of signup page", error);
    res.status(500).json({ msg: "Server error! try again later" });
  }
};

const loginPage = (req, res) => {
  res.render("login");
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).send({ msg: "Invalid email or password!" });
    }

    const verifyPassword = await userExist.comparePassword(password);

    if (!verifyPassword) {
      return res.status(400).send({ msg: "Invalid email or password!" });
    }

    // generate JWT token
    const token = jwt.sign(
      { email, id: userExist._id },
      process.env.JWTSECRETKEY,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).send({ success: true, redirectUrl: "/", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({ msg: "Server Error. Please try again later." });
  }
};

const checkLogin = async (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied! No Token Provided" });
  }

  const token = authToken.split(" ")[1];

  try {
    const decodeToken = jwt.verify(token, process.env.JWTSECRETKEY);

    if(!decodeToken){
      return res.status(400).send({msg: "First you should Login"})
    }
    res.status(200).send({ msg: "User is logged in!", user: decodeToken });
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: "Invalid or Expired Token" });
  }
};

const verifyOTP = async (req, res) => {
  const { verifiedOTP, email, phone, password, username } = req.body;

  if (!verifiedOTP) {
    return res.status(400).send({ msg: "Please enter the OTP" });
  }

  if (verifiedOTP != otpStore[email].originalOTP) {
    return res.status(400).send({ msg: "OTP is incorrect" });
  }

  if (otpStore[email].otpExpiration < Date.now()) {
    console.log("expire: ", otpStore[email].otpExpiration, "Right Now: ", Date.now() )
    delete otpStore;
    return res.status(400).send({ msg: "OTP has been expired" });
  }
  try {

    const userData = await User.create({ username, email, phone, password });
    const token = jwt.sign(
      { email, id: userData._id },
      process.env.JWTSECRETKEY,
      { expiresIn: "10d" }
    );

    res
    .status(201)
    .send({ msg: "Successfully user created", redirectUrl: "/", token });
    delete otpStore;

  } catch (error) {
    console.error("Verified OTP: ", error);
  }
};

const updatePassword = async (req, res) => {
  const {email} = req.body;

  try{
    const userData = await User.findOne({email})
  
    if(!userData){
      return res.status(400).json({msg: "Email is not exist"});
    }
  
    res.status(200).send({msg: "OTP sent successfully"})
  }catch(error){
    console.error(error)
    res.status(500).send({msg: "Server Error! Try again later"})
  }

}

module.exports = {
  signupPage,
  postSignup,
  checkLogin,
  loginPage,
  updatePassword,
  postLogin,
  verifyOTP,
};
