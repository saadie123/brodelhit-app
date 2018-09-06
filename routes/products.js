const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

router.get("/upload-product", (req, res) => {
  res.render("upload-product");
});

router.post("/upload-product", async (req, res) => {
  try {
    const uploadDir = path.resolve(__dirname, "..", "uploads");
    const productimgDir = path.resolve(uploadDir, "product-images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    if (!fs.existsSync(productimgDir)) {
      fs.mkdirSync(productimgDir);
    }
    const productImg = req.files.productImg;
    const productImgName = Date.now() + "-" + productImg.name;
    productImg.mv(`${productimgDir}/${productImgName}`, error => {
      if (error) console.log(error);
    });
    const product = new Product({
      title: req.body.title,
      category: req.body.category,
      details: req.body.details,
      date: req.body.date,
      link: req.body.link ? req.body.link : "",
      location: req.body.location ? req.body.location : "global",
      image: {
        imageName: productImgName,
        imagePath: productimgDir + "/" + productImgName
      },
      user: req.user.id
    });
    const savedProduct = await product.save();
    savedProduct.image.imageUrl = `/products/image/${savedProduct._id}`;
    await savedProduct.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
