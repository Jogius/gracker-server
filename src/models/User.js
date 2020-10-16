const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 1024,
    },
    lastName: {
      type: String,
      required: true,
      max: 1024,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 60,
      max: 60,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("user", UserSchema, "users");
