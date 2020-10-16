const jwt = require("jsonwebtoken");

const RefreshToken = require("../model/RefreshToken");

setRefreshToken = async (req, res, next) => {
  // Delete old JWT refresh token
  await RefreshToken.deleteOne({token: req.cookies["x-refresh-token"]});
  // Create new JWT Refresh Token
  const newRefreshToken = new RefreshToken({
    token: jwt.sign({id: req.user.id}, process.env.REFRESH_TOKEN_SECRET),
    userId: req.user.id,
  });
  // Save new JWT Refresh Token
  await newRefreshToken
    .save()
    .then((refreshToken) => {
      res.cookie("x-refresh-token", refreshToken.token, {
        maxAge: 604800000,
        httpOnly: true,
      });
    })
    // Catch saving error
    .catch((err) => {
      return res.json({error: err.message});
    });
  next();
};

module.exports = setRefreshToken;
