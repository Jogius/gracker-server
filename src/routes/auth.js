const router = require("express").Router();

const User = require("../models/User");

router.post("/register", async (req, res) => {
  // Check if user with given email already exists
  const emailExists = await User.findOne({email: req.body.email.toLowerCase()});
  if (emailExists) return res.json({error: "Email already in use!"});
});

module.exports = router;
