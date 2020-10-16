const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

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
          const newUser = User({
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

module.exports = router;
