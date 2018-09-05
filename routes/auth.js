const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const registerValidator = require("../validation/register");

router.get("/register-complete", (req, res) => {
  res.render("register-complete");
});

router.post("/signup", async (req, res) => {
  try {
    let { errors, isValid } = registerValidator(req.body);
    const oldUsername = await User.findOne({ username: req.body.username });
    if (oldUsername) {
      errors.push("Username is already taken");
      isValid = false;
    }
    const olduserEmail = await User.findOne({ email: req.body.email });
    if (olduserEmail) {
      errors.push("Email is already in use");
      isValid = false;
    }
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    });
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/"
  })
);

module.exports = router;
