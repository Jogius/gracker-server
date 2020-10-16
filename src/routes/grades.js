const router = require("express").Router();

const verifyToken = require("../util/verifyToken");
const setRefreshToken = require("../util/setRefreshToken");
const Grade = require("../model/Grade");
const {gradeValidation} = require("../util/validation");

router.get("/", verifyToken, setRefreshToken, (req, res) => {
  res.json({message: "YOU ARE VERIFIED! CONGRATS", user: req.user});
});

router.get("/:subject", verifyToken, setRefreshToken, async (req, res) => {
  const grades = await Grade.find({
    userId: req.user.id,
    subject: req.params.subject.toLowerCase(),
  });
  res.json({grades: grades});
});

router.post("/add", verifyToken, setRefreshToken, async (req, res) => {
  // Validate submitted grade data
  const {error} = gradeValidation(req.body);
  if (error) return res.json({error: error.details[0].message});

  // Create new Grade
  const newGrade = new Grade({
    userId: req.user.id,
    subject: req.body.subject.toLowerCase(),
    grade: parseInt(req.body.grade),
    gradeDate: req.body.gradeDate ? new Date(req.body.gradeDate) : undefined,
  });
  // Save new Grade
  await newGrade
    .save()
    .then((grade) => {
      return res.json({
        message: `Grade ${grade.grade} in subject ${grade.subject} created successfully!`,
      });
    })
    // Catch saving error
    .catch((err) => {
      return res.json({error: err.message});
    });
});

module.exports = router;
