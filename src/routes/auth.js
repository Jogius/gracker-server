const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

router.post("/register", async (req, res) => {
  // Check if user with given email already exists
  const emailExists = await User.findOne({email: req.body.email.toLowerCase()});
  if (emailExists) return res.json({error: "Email already in use!"});

  // Generate salt
  await bcrypt
    .genSalt()
    .then(async (salt) => {
      // Hash password
      await bcrypt
        .hash(req.body.password, salt)
        .then(async (hash) => {
          // Create new User
          const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(),
            password: hash,
          });
          // Save new User
          await newUser
            .save()
            .then((user) => {
              return res.json({
                message: `User "${user.email}" created successfully!`,
              });
            })
            // Catch saving error
            .catch((err) => {
              return res.json({error: err.message});
            });
        })
        // Catch hashing error
        .catch((err) => {
          return res.json({error: err.message});
        });
    })
    // Catch salt generation error
    .catch((err) => {
      return res.json({error: err.message});
    });
});

router.post("/login", async (req, res) => {
  // Check if user with given email address exists
  const user = await User.findOne({email: req.body.email.toLowerCase()});
  if (!user)
    return res.json({error: `User with email address ${req.body.email} does not exist!`});

  // Check if the correct password was used
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.json({error: "Invalid password!"});

  // Create JWT Refresh Token
  const newRefreshToken = new RefreshToken({
    token: jwt.sign({id: user._id}, process.env.REFRESH_TOKEN_SECRET),
    userId: user._id,
  });
  // Save JWT Refresh Token
  await newRefreshToken
    .save()
    .then((refreshToken) => {
      res
        .cookie("x-refresh-token", refreshToken, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .json({message: "Logged in successfully!"});
    })
    // Catch saving error
    .catch((err) => {
      return res.json({error: err.message});
    });
});

router.post("/token", async (req, res) => {
  const refreshToken = await RefreshToken.findOne({
    token: req.cookies["x-refresh-token"],
  });
  if (!refreshToken) return res.json({error: "Invalid refresh token!"});

  jwt.verify(
    req.cookies["x-refresh-token"],
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.json({error: err.message});
      res.json({
        message: "Token refreshed!",
        token: jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "10m",
        }),
      });
    }
  );
});

module.exports = router;
