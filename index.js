const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const server = express();

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`app running on port ${port}`));
