const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const registerValidator = require("../validation/register");

router.get("/register-complete", (req, res) => {
  res.render("register-complete", {
    message: "Registro de cuenta exitoso. Ahora puede iniciar sesión"
  });
});

router.get("/signin-success", (req, res) => {
  res.json({ success: true });
});

router.get("/signin-fail", (req, res) => {
  let error = req.flash("error");
  res.status(400).json({ error });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/signin-success",
    failureRedirect: "/signin-fail",
    failureFlash: "Nombre de usuario o contraseña incorrecta"
  })
);

router.post("/signup", async (req, res) => {
  try {
    let { errors, isValid } = registerValidator(req.body);
    const oldUsername = await User.findOne({ username: req.body.username });
    if (oldUsername) {
      errors.push("Este nombre de usuario ya está tomado");
      isValid = false;
    }
    const olduserEmail = await User.findOne({ email: req.body.email });
    if (olduserEmail) {
      errors.push("Correo electrónico ya está en uso");
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
    successRedirect: "/upload-product"
  })
);
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    successRedirect: "/upload-product"
  })
);
module.exports = router;
