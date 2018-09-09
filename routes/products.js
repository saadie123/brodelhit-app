const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const geoip = require("geoip-lite");
const Product = require("../models/Product");
const uploadProductValidator = require("../validation/upload-product");

router.get("/upload-product", (req, res) => {
  res.render("upload-product");
});

router.post("/upload-product", async (req, res) => {
  try {
    let { errors, isValid } = uploadProductValidator(req.body, req.files);
    if (!isValid) {
      return res.render("upload-product", { form: req.body, errors });
    }
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
      location: req.body.location ? req.body.location : "Todo el mundo",
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

router.get("/products/image/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.sendFile(product.image.imagePath);
  } catch (error) {
    console.log(error);
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const ip = req.connection.remoteAddress;
    const iploc = geoip.lookup(ip);
    let query = {
      location: "Todo el mundo"
    };
    if (iploc) {
      query = {
        $or: [
          { location: "Todo el mundo" },
          { location: { $regex: iploc.country, $options: "i" } },
          { location: { $regex: iploc.city, $options: "i" } },
          { location: { $regex: iploc.region, $options: "i" } }
        ]
      };
    }
    const id = req.params.id;
    const product = await Product.findById(id).populate("user");
    const products = await Product.find(query, {}, { count: 3 });
    res.render("product", { product, products });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
