const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/config");

const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

mongoose.connect(
  config.mongodbUri,
  { useNewUrlParser: true },
  () => console.log("Db connection successful")
);
const server = express();
server.engine("handlebars", exphbs({ defaultLayout: "main" }));
server.set("view engine", "handlebars");
server.use(express.static(path.resolve(__dirname, "public")));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(mainRoutes);
server.use(authRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`app running on port ${port}`));
