const express = require("express");

const app = express();
app.disable("x-powered-by");

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
