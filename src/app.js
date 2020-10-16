const express = require("express");

const app = express();
app.disable("x-powered-by");

const cors = require("cors");
app.use(cors({origin: process.env.ORIGIN_DOMAIN, credentials: true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost/Gracker",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to MongoDB")
);

module.exports = app;
