const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  provider: {
    type: String,
    default: "local"
  },
  participating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products"
    }
  ],
  description: String
});

module.exports = mongoose.model("users", userSchema);
