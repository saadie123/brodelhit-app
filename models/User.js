const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  provider: {
    type: String,
    default: "local"
  }
});

module.exports = mongoose.model("users", userSchema);
