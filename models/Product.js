const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    imageName: String,
    imagePath: String,
    imageUrl: String
  },
  category: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  link: String,
  location: {
    type: String,
    default: "Todo el mundo"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  }
});

module.exports = mongoose.model("products", productSchema);
