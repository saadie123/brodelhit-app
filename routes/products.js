const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const iplocation = require("iplocation");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const uploadProductValidator = require("../validation/upload-product");
const geocoder = require("../helpers/geocoder");

router.get("/upload-product", async (req, res) => {
  const categories = await Category.find();
  res.render("upload-product", { categories });
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
    let location = {
      city: "global",
      country: "global",
      countryCode: "global",
      address: "global"
    };
    if (req.body.location) {
      let loc = await geocoder.geocode({ address: req.body.location });
      if (loc) {
        location = {
          city: loc[0].city ? loc[0].city : loc[0].extra.neighborhood,
          country: loc[0].country,
          countryCode: loc[0].countryCode,
          address: loc[0].formattedAddress
        };
      }
    }
    const product = new Product({
      title: req.body.title,
      category: req.body.category,
      details: req.body.details,
      date: new Date(req.body.date),
      link: req.body.link ? req.body.link : "",
      location: location,
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
    const id = req.params.id;
    const today = new Date();
    let query = {
      location: {
        city: "global",
        country: "global",
        countryCode: "global",
        address: "global"
      },
      _id: { $ne: id },
      date: { $gte: today }
    };
    const ip = req.headers["x-forwarded-for"];
    const iploc = await iplocation(ip);
    if (iploc) {
      query = {
        _id: { $ne: id },
        $or: [
          {
            location: {
              city: "global",
              country: "global",
              countryCode: "global",
              address: "global"
            }
          },
          {
            "location.city": iploc.city
          },
          {
            "location.city": iploc.region
          },
          {
            "location.country": iploc.country_name
          },
          {
            "location.countryCode": iploc.country
          }
        ],
        date: { $gte: today }
      };
    }
    const product = await Product.findById(id).populate("user");
    if (req.user) {
      if (new Date(product.date) > new Date()) {
        if (product.user._id.toString() !== req.user.id.toString()) {
          let index;
          index = req.user.participating.indexOf(product._id);
          if (index < 0) {
            req.user.participating.push(product._id);
            await req.user.save();
          }
        }
      }
    }
    const products = await Product.find(query, {}, { count: 3 }).sort({
      date: "desc"
    });
    res.render("product", { product, products });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
