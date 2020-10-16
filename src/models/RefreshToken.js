const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

RefreshTokenSchema.index({createdAt: 1}, {expireAfterSeconds: 604800});

module.exports = mongoose.model("refreshToken", RefreshTokenSchema, "refreshTokens");
