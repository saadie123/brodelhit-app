const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const registerValidator = require("../validation/register");

router.get("/", (req, res) => {
  res.render("home");
});

module.exports = router;
