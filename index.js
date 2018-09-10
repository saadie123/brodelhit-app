const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const config = require("./config/config");
const passportConfig = require("./config/passport");
const dateHelper = require("./helpers/date");
const checkExpireHelper = require("./helpers/checkExpire");

const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

mongoose.connect(
  config.mongodbUri,
  { useNewUrlParser: true },
  () => console.log("Db connection successful")
);
const server = express();
server.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: { date: dateHelper, checkExpire: checkExpireHelper }
  })
);
server.set("view engine", "handlebars");
server.use(express.static(path.resolve(__dirname, "public")));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(flash());
server.use(fileUpload());
server.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret
  })
);
server.use(passport.initialize());
server.use(passport.session());

passportConfig(passport);
server.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
server.use(mainRoutes);
server.use(authRoutes);
server.use(productRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`app running on port ${port}`));
