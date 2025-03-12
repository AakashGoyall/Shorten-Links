// import module
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path")


const app = express();

// import files
const authRouter = require("./routes/auth.route");
const connectDb = require("./config/db");
const contactRouter = require("./routes/contact.route");
const urlRouter = require("./routes/url.route");

// use view engine
app.set("view engine", "ejs")
// app.set("views", "./views") // default path

const PORT = process.env.PORT || 5000;

const publicPath = path.join(__dirname, "public")

// Middlewares
app.use(express.static(publicPath))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/contact", contactRouter);
app.use('/', authRouter, urlRouter);


// Connect Db and listen server
connectDb().then(() => {
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at Port: ${PORT}`);
  });

    // Increase timeout settings for stability
    server.keepAliveTimeout = 120000;
    server.headersTimeout = 120000;
});
