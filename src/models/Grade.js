const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      min: 24,
      max: 24,
    },
    subject: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 15,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("grade", GradeSchema, "grades");
